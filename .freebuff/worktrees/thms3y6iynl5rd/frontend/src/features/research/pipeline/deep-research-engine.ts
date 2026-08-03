import { runtimeEventBus } from "@/runtime/events/event-bus";
import { researchRepository, ResearchSession, ResearchReport } from "@/repositories/research-repository";
import { ResearchPlanner } from "./research-planner";
import { EvidenceSynthesizer } from "./evidence-synthesizer";
import { HypothesisEngine } from "./hypothesis-engine";
import { ReportGenerator } from "./report-generator";

export interface DeepResearchExecutionOptions {
  workspaceId: string;
  userId: string;
  title: string;
  objective: string;
  depthLevel?: "fast" | "standard" | "deep" | "exhaustive";
}

export class DeepResearchEngine {
  static async execute(options: DeepResearchExecutionOptions): Promise<{ session: ResearchSession; report: ResearchReport }> {
    const { workspaceId, userId, title, objective, depthLevel = "standard" } = options;

    // 1. Create Session
    const session = await researchRepository.createSession({
      workspaceId,
      userId,
      title,
      objective,
      depthLevel,
    });

    runtimeEventBus.publish("RESEARCH_STARTED", { sessionId: session.id, title, objective });

    // 2. Formulate Strategy & Plan
    await researchRepository.updateSessionStatus(session.id, "planning");
    const plan = ResearchPlanner.createPlan(objective, depthLevel);

    runtimeEventBus.publish("RESEARCH_PROGRESS_UPDATED", {
      sessionId: session.id,
      stage: "planning",
      progressPercent: 20,
      message: "Research plan formulated with initial hypotheses.",
    });

    // 3. Iterative Evidence Execution Loop
    await researchRepository.updateSessionStatus(session.id, "executing");
    const totalTasks = plan.subQueries.length;
    let accumulatedEvidence: any[] = [];

    for (let i = 0; i < totalTasks; i++) {
      const task = plan.subQueries[i];
      const synthResult = await EvidenceSynthesizer.synthesizeForTask(
        session.id,
        workspaceId,
        task.query,
        task.assignedRole
      );

      for (const ev of synthResult.evidenceList) {
        const addedEv = await researchRepository.addEvidence(ev);
        accumulatedEvidence.push(addedEv);
        runtimeEventBus.publish("RESEARCH_EVIDENCE_ADDED", {
          sessionId: session.id,
          evidenceId: addedEv.id,
          sourceTitle: addedEv.sourceTitle,
        });
      }

      const progressPercent = Math.min(80, 20 + Math.floor(((i + 1) / totalTasks) * 60));
      runtimeEventBus.publish("RESEARCH_PROGRESS_UPDATED", {
        sessionId: session.id,
        stage: "executing",
        progressPercent,
        message: `Completed task #${i + 1}: ${task.query.slice(0, 45)}...`,
      });
    }

    // 4. Hypothesis Resolution & Reflection Matrix
    await researchRepository.updateSessionStatus(session.id, "synthesizing");
    const currentEvidence = await researchRepository.getEvidence(session.id);
    const hypEval = HypothesisEngine.evaluateHypotheses(
      session.id,
      workspaceId,
      plan.initialHypotheses,
      currentEvidence
    );

    for (const hyp of hypEval.updatedHypotheses) {
      await researchRepository.addHypothesis(hyp);
    }

    // Update Session Confidence
    session.currentIteration = plan.estimatedIterations;
    session.confidenceScore = hypEval.overallConfidence;
    await researchRepository.updateSessionStatus(session.id, "completed", hypEval.overallConfidence);

    // 5. Generate Final Report
    const currentHypotheses = await researchRepository.getHypotheses(session.id);
    const reportData = ReportGenerator.generateReport(session, currentEvidence, currentHypotheses);
    const report = await researchRepository.saveReport(reportData);

    runtimeEventBus.publish("RESEARCH_COMPLETED", {
      sessionId: session.id,
      reportId: report.id,
      confidenceScore: hypEval.overallConfidence,
      citationsCount: report.citationsCount,
    });

    return { session, report };
  }
}

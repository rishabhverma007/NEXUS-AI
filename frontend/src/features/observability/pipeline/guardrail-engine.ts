import { observabilityRepository, GuardrailEvent } from "@/repositories/observability-repository";
import { runtimeEventBus } from "@/runtime/events/event-bus";

export interface GuardrailValidationResult {
  isValid: boolean;
  actionTaken: GuardrailEvent["actionTaken"];
  sanitizedText: string;
  matchedRules: string[];
  guardrailEvent?: GuardrailEvent;
}

export class GuardrailEngine {
  private static piiPatterns = [
    { name: "SSN", regex: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: "[SSN_REDACTED]" },
    { name: "EMAIL", regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: "[EMAIL_REDACTED]" },
    { name: "CREDIT_CARD", regex: /\b(?:\d[ -]*?){13,16}\b/g, replacement: "[CARD_REDACTED]" },
  ];

  private static injectionPatterns = [
    { name: "SYSTEM_OVERRIDE", regex: /ignore\s+all\s+previous\s+instructions/i },
    { name: "JAILBREAK_DAN", regex: /do\s+anything\s+now/i },
    { name: "CREDENTIAL_EXFIL", regex: /output\s+system\s+prompt|show\s+api\s+keys/i },
  ];

  static async validatePrompt(
    workspaceId: string,
    userId: string,
    inputText: string
  ): Promise<GuardrailValidationResult> {
    const matchedRules: string[] = [];
    let sanitizedText = inputText;
    let actionTaken: GuardrailEvent["actionTaken"] = "flagged";
    let isBlocked = false;

    // 1. Prompt Injection Scan
    for (const inj of GuardrailEngine.injectionPatterns) {
      if (inj.regex.test(inputText)) {
        matchedRules.push(`PROMPT_INJECTION_${inj.name}`);
        isBlocked = true;
        actionTaken = "blocked";
        sanitizedText = "[PROMPT_INJECTION_BLOCKED]";
      }
    }

    // 2. PII Detection Scan
    if (!isBlocked) {
      for (const pii of GuardrailEngine.piiPatterns) {
        if (pii.regex.test(inputText)) {
          matchedRules.push(`PII_${pii.name}`);
          sanitizedText = sanitizedText.replace(pii.regex, pii.replacement);
          actionTaken = "masked";
        }
      }
    }

    let guardrailEvent: GuardrailEvent | undefined;

    if (matchedRules.length > 0) {
      guardrailEvent = await observabilityRepository.addGuardrailEvent({
        workspaceId,
        userId,
        guardrailType: isBlocked ? "prompt_validation" : "pii_detection",
        severity: isBlocked ? "high" : "medium",
        actionTaken,
        inputText,
        sanitizedText,
        matchedRule: matchedRules.join(", "),
      });

      runtimeEventBus.publish("GUARDRAIL_TRIGGERED", {
        workspaceId,
        guardrailType: guardrailEvent.guardrailType,
        matchedRules,
        actionTaken,
      });

      if (isBlocked) {
        runtimeEventBus.publish("POLICY_VIOLATION", {
          workspaceId,
          policyName: "Prompt Security & Injection Prevention",
          matchedRules,
        });
      }
    }

    return {
      isValid: !isBlocked,
      actionTaken,
      sanitizedText,
      matchedRules,
      guardrailEvent,
    };
  }

  static async validateToolCall(
    workspaceId: string,
    toolId: string,
    inputPayload: any
  ): Promise<{ allowed: boolean; reason?: string }> {
    const dangerousCommands = ["rm -rf", "drop table", "shutdown", "sudo"];
    const payloadStr = JSON.stringify(inputPayload).toLowerCase();

    for (const cmd of dangerousCommands) {
      if (payloadStr.includes(cmd)) {
        await observabilityRepository.addGuardrailEvent({
          workspaceId,
          guardrailType: "unsafe_tool",
          severity: "critical",
          actionTaken: "blocked",
          inputText: `Tool Execution Blocked: ${toolId} with payload: ${payloadStr}`,
          sanitizedText: "[UNSAFE_TOOL_EXECUTION_BLOCKED]",
          matchedRule: `UNSAFE_TOOL_COMMAND_${cmd.toUpperCase()}`,
        });

        runtimeEventBus.publish("GUARDRAIL_TRIGGERED", {
          workspaceId,
          guardrailType: "unsafe_tool",
          matchedRules: [`UNSAFE_TOOL_${cmd.toUpperCase()}`],
          actionTaken: "blocked",
        });

        return { allowed: false, reason: `Unsafe command '${cmd}' detected in tool input.` };
      }
    }

    return { allowed: true };
  }
}

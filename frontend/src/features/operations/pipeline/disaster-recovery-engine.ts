import { operationsRepository, DisasterBackupItem } from "@/repositories/operations-repository";
import { runtimeEventBus } from "@/runtime/events/event-bus";

export class DisasterRecoveryEngine {
  static async triggerBackup(type: DisasterBackupItem["backupType"]): Promise<DisasterBackupItem> {
    const backup = await operationsRepository.createBackup(type);
    runtimeEventBus.publish("BACKUP_COMPLETED", {
      backupId: backup.id,
      backupType: type,
      sizeBytes: backup.sizeBytes,
    });
    return backup;
  }
}

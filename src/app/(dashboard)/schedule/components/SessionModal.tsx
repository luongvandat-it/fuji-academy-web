"use client";

import { CloseIcon } from "@/icon";
import type { ClassSessionData } from "@/service/modules/class/logic";
import { formatTimeFromDatetime } from "@/app/(dashboard)/schedule/utils";
import styles from "../schedule.module.scss";

function formatDateVi(ymd: string): string {
  const d = new Date(ymd + "T00:00:00");
  return d.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

interface SessionModalProps {
  session: ClassSessionData;
  onClose: () => void;
}

export function SessionModal({ session, onClose }: SessionModalProps) {
  const startTime = formatTimeFromDatetime(session.start_time);
  const endTime = formatTimeFromDatetime(session.end_time);

  return (
    <div
      className={styles.sessionModalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-modal-title"
    >
      <div className={styles.sessionModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.sessionModalHeader}>
          <h2 id="session-modal-title" className={styles.sessionModalTitle}>
            {session.session_name}
          </h2>
          <button
            type="button"
            className={styles.sessionModalClose}
            onClick={onClose}
            aria-label="Đóng"
          >
            <CloseIcon />
          </button>
        </div>
        <div className={styles.sessionModalBody}>
          <dl className="space-y-2">
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>Lớp</dt>
              <dd className={styles.sessionModalValue}>{session.class_name}</dd>
            </div>
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>Môn học</dt>
              <dd className={styles.sessionModalValue}>{session.subject_name}</dd>
            </div>
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>Giáo viên</dt>
              <dd className={styles.sessionModalValue}>{session.teacher_name}</dd>
            </div>
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>Phòng</dt>
              <dd className={styles.sessionModalValue}>{session.classroom_name}</dd>
            </div>
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>Ngày</dt>
              <dd className={styles.sessionModalValue}>{formatDateVi(session.date)}</dd>
            </div>
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>Giờ</dt>
              <dd className={styles.sessionModalValue}>
                {startTime} – {endTime}
              </dd>
            </div>
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>Hình thức</dt>
              <dd className={styles.sessionModalValue}>
                {session.class_type === "online" ? "Trực tuyến" : "Trực tiếp"}
              </dd>
            </div>
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>Trạng thái</dt>
              <dd className={styles.sessionModalValue}>{session.status_label}</dd>
            </div>
            {session.attendance?.has_attendance && (
              <div className={styles.sessionModalRow}>
                <dt className={styles.sessionModalLabel}>Điểm danh</dt>
                <dd className={styles.sessionModalValue}>
                  {session.attendance.is_present ? "Có mặt" : session.attendance.is_absent ? "Vắng" : "—"}
                </dd>
              </div>
            )}
            {session.notes?.trim() && (
              <div className={styles.sessionModalRow}>
                <dt className={styles.sessionModalLabel}>Ghi chú</dt>
                <dd className={styles.sessionModalValue}>{session.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}

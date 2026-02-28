"use client";

import { CloseIcon } from "@/icon";
import { Button, Text } from "@/components/ui";
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
          <Text variant="HEADING.TWO" as="h2" id="session-modal-title" className={styles.sessionModalTitle}>
            {session.session_name}
          </Text>
          <Button
            type="button"
            variant="secondary"
            className={styles.sessionModalClose}
            onClick={onClose}
            aria-label="Đóng"
          >
            <CloseIcon />
          </Button>
        </div>
        <div className={styles.sessionModalBody}>
          <dl className={styles.sessionModalDl}>
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>
                <Text variant="LABEL.MEDIUM" as="span">
                  Lớp
                </Text>
              </dt>
              <dd className={styles.sessionModalValue}>
                <Text variant="BODY.MEDIUM" as="span">
                  {session.class_name}
                </Text>
              </dd>
            </div>
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>
                <Text variant="LABEL.MEDIUM" as="span">
                  Môn học
                </Text>
              </dt>
              <dd className={styles.sessionModalValue}>
                <Text variant="BODY.MEDIUM" as="span">
                  {session.subject_name}
                </Text>
              </dd>
            </div>
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>
                <Text variant="LABEL.MEDIUM" as="span">
                  Giáo viên
                </Text>
              </dt>
              <dd className={styles.sessionModalValue}>
                <Text variant="BODY.MEDIUM" as="span">
                  {session.teacher_name}
                </Text>
              </dd>
            </div>
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>
                <Text variant="LABEL.MEDIUM" as="span">
                  Phòng
                </Text>
              </dt>
              <dd className={styles.sessionModalValue}>
                <Text variant="BODY.MEDIUM" as="span">
                  {session.classroom_name}
                </Text>
              </dd>
            </div>
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>
                <Text variant="LABEL.MEDIUM" as="span">
                  Ngày
                </Text>
              </dt>
              <dd className={styles.sessionModalValue}>
                <Text variant="BODY.MEDIUM" as="span">
                  {formatDateVi(session.date)}
                </Text>
              </dd>
            </div>
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>
                <Text variant="LABEL.MEDIUM" as="span">
                  Giờ
                </Text>
              </dt>
              <dd className={styles.sessionModalValue}>
                <Text variant="BODY.MEDIUM" as="span">
                  {startTime} – {endTime}
                </Text>
              </dd>
            </div>
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>
                <Text variant="LABEL.MEDIUM" as="span">
                  Hình thức
                </Text>
              </dt>
              <dd className={styles.sessionModalValue}>
                <Text variant="BODY.MEDIUM" as="span">
                  {session.class_type === "online" ? "Trực tuyến" : "Trực tiếp"}
                </Text>
              </dd>
            </div>
            <div className={styles.sessionModalRow}>
              <dt className={styles.sessionModalLabel}>
                <Text variant="LABEL.MEDIUM" as="span">
                  Trạng thái
                </Text>
              </dt>
              <dd className={styles.sessionModalValue}>
                <Text variant="BODY.MEDIUM" as="span">
                  {session.status_label}
                </Text>
              </dd>
            </div>
            {session.attendance?.has_attendance && (
              <div className={styles.sessionModalRow}>
                <dt className={styles.sessionModalLabel}>
                  <Text variant="LABEL.MEDIUM" as="span">
                    Điểm danh
                  </Text>
                </dt>
                <dd className={styles.sessionModalValue}>
                  <Text variant="BODY.MEDIUM" as="span">
                    {session.attendance.is_present === true ? "Có mặt" : session.attendance.is_absent === true ? "Vắng" : "—"}
                  </Text>
                </dd>
              </div>
            )}
            {session.notes?.trim() && (
              <div className={styles.sessionModalRow}>
                <dt className={styles.sessionModalLabel}>
                  <Text variant="LABEL.MEDIUM" as="span">
                    Ghi chú
                  </Text>
                </dt>
                <dd className={styles.sessionModalValue}>
                  <Text variant="BODY.MEDIUM" as="span">
                    {session.notes}
                  </Text>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}

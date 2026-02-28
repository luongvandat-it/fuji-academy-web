"use client";

import { Text } from "@/components/ui";
import { ReportIcon } from "@/icon";
import {
  SummaryCards,
  BarChartCard,
  RecentActivity,
  CourseProgressTable,
} from "./components";
import {
  MOCK_COURSE_COMPLETION,
  MOCK_AVERAGE_SCORE,
  MOCK_SESSION_PARTICIPATION,
  MOCK_CLASS_PROGRESS,
  MOCK_ATTENDANCE_RATE,
  MOCK_AVG_TEST_BY_CLASS,
  MOCK_HOMEWORK_RATE,
  MOCK_ON_TIME_STATS,
  MOCK_RECENT_ACTIVITY,
  MOCK_COURSE_PROGRESS,
} from "./mockData";
import styles from "./report.module.scss";

export default function ReportPage() {
  const handleDownloadReport = () => {
  };

  return (
    <article className={`${styles.page} report-page`} aria-labelledby="report-page-title">
      <header className={styles.header}>
        <div>
          <Text variant="HEADING.ONE" as="h1" id="report-page-title" className={styles.title}>
            Báo cáo học tập
          </Text>
          <Text variant="BODY.MEDIUM" as="p" className={styles.subtitle}>
            Tổng quan về tiến độ và kết quả của bạn.
          </Text>
        </div>
        <ReportIcon className={styles.headerIcon} aria-hidden />
      </header>

      <div className={styles.contentScroll}>
        <SummaryCards
          courseCompletionPercent={MOCK_COURSE_COMPLETION.percent}
          courseCompletionChange={MOCK_COURSE_COMPLETION.change}
          averageScore={MOCK_AVERAGE_SCORE.value}
          averageScoreMax={MOCK_AVERAGE_SCORE.max}
        />

        <div className={styles.middleGrid}>
          <div className={styles.chartsCol}>
            <BarChartCard
              title="Tiến độ tham gia buổi của khóa"
              items={MOCK_SESSION_PARTICIPATION}
            />
            <BarChartCard
              title="Tiến độ của lớp học"
              items={MOCK_CLASS_PROGRESS}
            />
            <BarChartCard title="Tỉ lệ đi học" items={MOCK_ATTENDANCE_RATE} />
            <BarChartCard
              title="Điểm kiểm tra trung bình / lớp"
              items={MOCK_AVG_TEST_BY_CLASS}
            />
            <BarChartCard
              title="Tỉ lệ làm bài tập / nộp bài tập"
              items={MOCK_HOMEWORK_RATE}
            />
            <BarChartCard title="Thống kê đúng giờ" items={MOCK_ON_TIME_STATS} />
          </div>
          <aside aria-label="Hoạt động gần đây">
            <RecentActivity items={MOCK_RECENT_ACTIVITY} />
          </aside>
        </div>

        <CourseProgressTable
          items={MOCK_COURSE_PROGRESS}
          onDownload={handleDownloadReport}
        />
      </div>
    </article>
  );
}

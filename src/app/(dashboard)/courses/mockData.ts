import type { Course, Quiz } from "./types";

const YOUTUBE_VIDEO_URL =
  "https://www.youtube.com/watch?v=983bBbJx0Mk&list=RD983bBbJx0Mk&start_radio=1";

const VIDEO_INTRO = "https://www.youtube.com/watch?v=983bBbJx0Mk";
const VIDEO_GOALS = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const VIDEO_WRITE_CV = "https://www.youtube.com/watch?v=jNQXAC9IVRw";

const thumb = (id: number) => `https://picsum.photos/id/${id}/400/250`;

export const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Chiến lược học tập: cách học thay vì học gì",
    thumbnailUrl: thumb(1),
    description:
      "Tập trung vào quá trình học thay vì chỉ nội dung. Xây dựng thói quen giúp bạn ghi nhớ và vận dụng kiến thức hiệu quả.",
    rating: 5,
    reviewCount: 1034,
    level: "Mọi cấp độ",
    videoUrl: YOUTUBE_VIDEO_URL,
    instructor: {
      name: "Nguyễn Thị Mai",
      title: "Chuyên gia phương pháp học",
    },
    lessons: [
      {
        id: "l1-1",
        title: "Giới thiệu khóa học",
        description: "Tổng quan về phương pháp học tập hiệu quả.",
        durationMins: 4,
        type: "video",
        videoUrl: VIDEO_INTRO,
      },
      {
        id: "l1-2",
        title: "Xây dựng thói quen",
        description: "Cách hình thành và duy trì thói quen học.",
        durationMins: 6,
        type: "text",
        content:
          "Thói quen học tập được xây dựng qua các bước:\n\n1. **Xác định mục tiêu rõ ràng** – Biết bạn muốn đạt được gì sau mỗi buổi học.\n\n2. **Dành thời gian cố định mỗi ngày** – Chỉ cần 15–30 phút nhưng đều đặn sẽ hiệu quả hơn học dồn.\n\n3. **Tạo không gian học tập** – Một góc yên tĩnh, ít bị gián đoạn giúp bạn tập trung.\n\n4. **Ôn lại ngắn sau khi học** – Dành 2–3 phút nhắc lại ý chính giúp ghi nhớ lâu hơn.",
      },
      {
        id: "l1-3",
        title: "Bài kiểm tra cuối khóa",
        description: "Kiểm tra lại kiến thức đã học.",
        durationMins: 15,
        type: "quiz",
        quizId: "quiz-1",
      },
    ],
  },
  {
    id: "2",
    title: "Tiếng Anh cho phát triển nghề nghiệp",
    thumbnailUrl: thumb(2),
    description:
      "Nâng cao tiếng Anh cho tìm việc, nộp hồ sơ, phỏng vấn và con đường sự nghiệp toàn cầu. Phát triển kỹ năng ngôn ngữ cần thiết để thăng tiến.",
    rating: 4,
    reviewCount: 294,
    level: "Trung cấp",
    videoUrl: YOUTUBE_VIDEO_URL,
    instructor: {
      name: "Trần Minh Tuấn",
      title: "Giáo viên tiếng Anh chuyên nghiệp",
    },
    lessons: [
      {
        id: "l1",
        title: "Giới thiệu",
        description: "Gặp gỡ giáo viên và xem bạn sẽ học những gì trong khóa này.",
        durationMins: 3.29,
        type: "video",
        isActive: true,
        videoUrl: VIDEO_INTRO,
      },
      {
        id: "l2",
        title: "Xác định mục tiêu",
        description: "Học cách đặt và đạt được mục tiêu nghề nghiệp.",
        durationMins: 5.42,
        type: "video",
        videoUrl: VIDEO_GOALS,
      },
      {
        id: "l1a",
        title: "Tài liệu kèm theo",
        description: "Giới thiệu tài liệu và nguồn tham khảo của khóa.",
        durationMins: 2,
        type: "text",
        content:
          "Khóa học cung cấp:\n\n• **Slide bài giảng** – Tải sau mỗi bài video.\n• **File mẫu CV** – Dùng để chỉnh sửa theo hướng dẫn.\n• **Danh sách câu hỏi phỏng vấn** – Luyện trả lời trước khi đi phỏng vấn.\n\nBạn nên hoàn thành từng bài nhỏ trong Bài mở đầu trước khi chuyển sang phần Kỹ năng viết hồ sơ.",
      },
      {
        id: "l1b",
        title: "Theo dõi tiến độ",
        description: "Cách xem và theo dõi tiến độ học của bạn.",
        durationMins: 2.5,
        type: "video",
        videoUrl: VIDEO_INTRO,
      },
      {
        id: "l1c",
        title: "Câu hỏi thường gặp",
        description: "Giải đáp nhanh các thắc mắc về khóa học.",
        durationMins: 3,
        type: "text",
        content:
          "**Làm sao để đánh dấu đã học?**\n\nHoàn thành từng bài nhỏ (video, đọc, hoặc nộp bài kiểm tra) để hệ thống ghi nhận. Bạn cần hoàn thành lần lượt các mục trong từng module.\n\n**Có thể bỏ qua bài không?**\n\nBạn có thể xem bất kỳ bài nào, nhưng nên hoàn thành theo thứ tự để nắm vững kiến thức.",
      },
      {
        id: "l3",
        title: "Viết CV",
        description: "Xây dựng CV chuyên nghiệp nổi bật.",
        durationMins: 7.15,
        type: "video",
        videoUrl: VIDEO_WRITE_CV,
      },
      {
        id: "l3b",
        title: "Tóm tắt và mẹo phỏng vấn",
        description: "Nội dung đọc về cách chuẩn bị phỏng vấn bằng tiếng Anh.",
        durationMins: 8,
        type: "text",
        content:
          "**Chuẩn bị trước buổi phỏng vấn**\n\n• Nghiên cứu công ty và vị trí ứng tuyển.\n• Chuẩn bị giới thiệu bản thân (self-introduction) ngắn gọn, nhấn mạnh kinh nghiệm và điểm mạnh.\n• Liệt kê các câu hỏi thường gặp và luyện trả lời bằng tiếng Anh.\n\n**Trong buổi phỏng vấn**\n\n• Lắng nghe kỹ câu hỏi, có thể xin nhắc lại nếu chưa rõ: \"Could you repeat that, please?\"\n• Trả lời có cấu trúc: mở đầu, ví dụ cụ thể, kết luận.\n• Dùng thì quá khứ cho kinh nghiệm, thì hiện tại cho vai trò hiện tại.\n\n**Sau phỏng vấn**\n\n• Gửi email cảm ơn trong vòng 24 giờ (thank-you email).\n• Nhắc lại sự quan tâm tới vị trí và tóm tắt ngắn điểm nổi bật của bạn.",
      },
      {
        id: "l4",
        title: "Bài kiểm tra cuối khóa",
        description: "Kiểm tra kiến thức tiếng Anh nghề nghiệp.",
        durationMins: 20,
        type: "quiz",
        quizId: "quiz-2",
      },
    ],
    modules: [
      {
        id: "m1",
        title: "Bài mở đầu",
        lessons: [
          {
            id: "l1",
            title: "Giới thiệu",
            description: "Gặp gỡ giáo viên và xem bạn sẽ học những gì trong khóa này.",
            durationMins: 3.29,
            isActive: true,
            type: "video",
            videoUrl: VIDEO_INTRO,
          },
          {
            id: "l2",
            title: "Xác định mục tiêu",
            description: "Học cách đặt và đạt được mục tiêu nghề nghiệp.",
            durationMins: 5.42,
            type: "video",
            videoUrl: VIDEO_GOALS,
          },
          {
            id: "l1a",
            title: "Tài liệu kèm theo",
            description: "Giới thiệu tài liệu và nguồn tham khảo của khóa.",
            durationMins: 2,
            type: "text",
            content:
              "Khóa học cung cấp:\n\n• **Slide bài giảng** – Tải sau mỗi bài video.\n• **File mẫu CV** – Dùng để chỉnh sửa theo hướng dẫn.\n• **Danh sách câu hỏi phỏng vấn** – Luyện trả lời trước khi đi phỏng vấn.\n\nBạn nên hoàn thành từng bài nhỏ trong Bài mở đầu trước khi chuyển sang phần Kỹ năng viết hồ sơ.",
          },
          {
            id: "l1b",
            title: "Theo dõi tiến độ",
            description: "Cách xem và theo dõi tiến độ học của bạn.",
            durationMins: 2.5,
            type: "video",
            videoUrl: VIDEO_INTRO,
          },
          {
            id: "l1c",
            title: "Câu hỏi thường gặp",
            description: "Giải đáp nhanh các thắc mắc về khóa học.",
            durationMins: 3,
            type: "text",
            content:
              "**Làm sao để đánh dấu đã học?**\n\nHoàn thành từng bài nhỏ (video, đọc, hoặc nộp bài kiểm tra) để hệ thống ghi nhận. Bạn cần hoàn thành lần lượt các mục trong từng module.\n\n**Có thể bỏ qua bài không?**\n\nBạn có thể xem bất kỳ bài nào, nhưng nên hoàn thành theo thứ tự để nắm vững kiến thức.",
          },
        ],
      },
      {
        id: "m2",
        title: "Kỹ năng viết hồ sơ",
        lessons: [
          {
            id: "l3",
            title: "Viết CV",
            description: "Xây dựng CV chuyên nghiệp nổi bật.",
            durationMins: 7.15,
            type: "video",
            videoUrl: VIDEO_WRITE_CV,
          },
          {
            id: "l3b",
            title: "Tóm tắt và mẹo phỏng vấn",
            description: "Nội dung đọc về cách chuẩn bị phỏng vấn bằng tiếng Anh.",
            durationMins: 8,
            type: "text",
            content:
              "**Chuẩn bị trước buổi phỏng vấn**\n\n• Nghiên cứu công ty và vị trí ứng tuyển.\n• Chuẩn bị giới thiệu bản thân (self-introduction) ngắn gọn, nhấn mạnh kinh nghiệm và điểm mạnh.\n• Liệt kê các câu hỏi thường gặp và luyện trả lời bằng tiếng Anh.\n\n**Trong buổi phỏng vấn**\n\n• Lắng nghe kỹ câu hỏi, có thể xin nhắc lại nếu chưa rõ: \"Could you repeat that, please?\"\n• Trả lời có cấu trúc: mở đầu, ví dụ cụ thể, kết luận.\n• Dùng thì quá khứ cho kinh nghiệm, thì hiện tại cho vai trò hiện tại.\n\n**Sau phỏng vấn**\n\n• Gửi email cảm ơn trong vòng 24 giờ (thank-you email).\n• Nhắc lại sự quan tâm tới vị trí và tóm tắt ngắn điểm nổi bật của bạn.",
          },
          {
            id: "l4",
            title: "Bài kiểm tra cuối khóa",
            description: "Kiểm tra kiến thức tiếng Anh nghề nghiệp.",
            durationMins: 20,
            type: "quiz",
            quizId: "quiz-2",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Bước đầu với tiếng Trung",
    thumbnailUrl: thumb(3),
    description:
      "Bắt đầu hành trình với tiếng Trung phổ thông. Học cụm từ cơ bản, chữ viết và mẹo giao tiếp hàng ngày.",
    rating: 5,
    reviewCount: 512,
    level: "Sơ cấp",
    instructor: {
      name: "Lâm Văn Hòa",
      title: "Giáo viên tiếng Trung",
    },
    lessons: [],
  },
  {
    id: "4",
    title: "Excel từ cơ bản đến nâng cao",
    thumbnailUrl: thumb(4),
    description:
      "Làm chủ công thức, bảng pivot, biểu đồ và tự động hóa với Excel. Phù hợp cho văn phòng và phân tích dữ liệu.",
    rating: 4.5,
    reviewCount: 2103,
    level: "Mọi cấp độ",
    instructor: { name: "Phạm Văn Đức", title: "Chuyên gia tin học văn phòng" },
    lessons: [],
  },
  {
    id: "5",
    title: "Kỹ năng thuyết trình chuyên nghiệp",
    thumbnailUrl: thumb(5),
    description:
      "Xây dựng slide ấn tượng, kiểm soát giọng nói và ngôn ngữ cơ thể để thuyết trình tự tin trước đám đông.",
    rating: 5,
    reviewCount: 876,
    level: "Trung cấp",
    instructor: { name: "Nguyễn Thị Hương", title: "Coach giao tiếp" },
    lessons: [],
  },
  {
    id: "6",
    title: "Lập trình Python cho người mới bắt đầu",
    thumbnailUrl: thumb(6),
    description:
      "Học Python từ con số 0: biến, hàm, vòng lặp, xử lý file. Làm quen với lập trình qua bài tập thực hành.",
    rating: 4.8,
    reviewCount: 3421,
    level: "Sơ cấp",
    instructor: { name: "Trần Hoàng Nam", title: "Kỹ sư phần mềm" },
    lessons: [],
  },
  {
    id: "7",
    title: "Quản lý thời gian và năng suất",
    thumbnailUrl: thumb(7),
    description:
      "Phương pháp Pomodoro, Eisenhower matrix, và các công cụ lên kế hoạch giúp bạn làm việc hiệu quả hơn.",
    rating: 4.6,
    reviewCount: 654,
    level: "Mọi cấp độ",
    instructor: { name: "Lê Minh Anh", title: "Chuyên gia phát triển bản thân" },
    lessons: [],
  },
  {
    id: "8",
    title: "Tiếng Nhật giao tiếp cơ bản",
    thumbnailUrl: thumb(8),
    description:
      "Hiragana, Katakana, các mẫu câu chào hỏi, mua sắm và du lịch. Chuẩn bị cho kỳ thi JLPT N5.",
    rating: 4.9,
    reviewCount: 1205,
    level: "Sơ cấp",
    instructor: { name: "Võ Thị Mai", title: "Giáo viên tiếng Nhật" },
    lessons: [],
  },
  {
    id: "9",
    title: "Digital Marketing căn bản",
    thumbnailUrl: thumb(9),
    description:
      "SEO, quảng cáo Facebook/Google, email marketing và đo lường hiệu quả. Dành cho người làm marketing và kinh doanh online.",
    rating: 4.4,
    reviewCount: 1892,
    level: "Trung cấp",
    instructor: { name: "Hoàng Quốc Bảo", title: "Digital marketing manager" },
    lessons: [],
  },
  {
    id: "10",
    title: "Thiết kế UI/UX với Figma",
    thumbnailUrl: thumb(10),
    description:
      "Từ wireframe đến prototype. Học design system, component và tương tác cơ bản trong Figma.",
    rating: 4.7,
    reviewCount: 756,
    level: "Trung cấp",
    instructor: { name: "Đặng Thu Hà", title: "UI/UX designer" },
    lessons: [],
  },
  {
    id: "11",
    title: "Kế toán doanh nghiệp nhỏ",
    thumbnailUrl: thumb(11),
    description:
      "Sổ sách, báo cáo tài chính cơ bản, thuế GTGT và thuế TNDN. Dành cho chủ doanh nghiệp và kế toán viên.",
    rating: 4.5,
    reviewCount: 432,
    level: "Trung cấp",
    instructor: { name: "Phan Thị Ngọc", title: "Kế toán trưởng" },
    lessons: [],
  },
  {
    id: "12",
    title: "Giao tiếp tiếng Hàn trong công việc",
    thumbnailUrl: thumb(12),
    description:
      "Từ vựng và mẫu câu trong email, họp, thương lượng. Luyện phát âm và văn hóa làm việc Hàn Quốc.",
    rating: 4.8,
    reviewCount: 567,
    level: "Trung cấp",
    instructor: { name: "Kim Min-ho", title: "Giáo viên tiếng Hàn" },
    lessons: [],
  },
  {
    id: "13",
    title: "React.js xây dựng ứng dụng web",
    thumbnailUrl: thumb(13),
    description:
      "Components, hooks, state management và tích hợp API. Xây dựng project thực tế từ A đến Z.",
    rating: 4.6,
    reviewCount: 2108,
    level: "Trung cấp",
    instructor: { name: "Nguyễn Văn Tài", title: "Frontend developer" },
    lessons: [],
  },
  {
    id: "14",
    title: "Viết content thu hút",
    thumbnailUrl: thumb(14),
    description:
      "Cấu trúc bài viết, headline, storytelling và SEO content. Áp dụng cho blog, social và landing page.",
    rating: 4.3,
    reviewCount: 923,
    level: "Mọi cấp độ",
    instructor: { name: "Trần Thị Lan", title: "Content lead" },
    lessons: [],
  },
  {
    id: "15",
    title: "Quản lý dự án với Agile/Scrum",
    thumbnailUrl: thumb(15),
    description:
      "Sprint planning, daily standup, retrospective. Cách vận hành Scrum trong team phần mềm và sản phẩm.",
    rating: 4.7,
    reviewCount: 1156,
    level: "Trung cấp",
    instructor: { name: "Lý Minh Tuấn", title: "Scrum master" },
    lessons: [],
  },
];

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: "quiz-1",
    title: "Bài kiểm tra cuối khóa - Chiến lược học tập",
    questions: [
      {
        id: "q1-1",
        type: "multiple_choice",
        text: "Theo bài học, yếu tố nào quan trọng nhất khi xây dựng thói quen học tập?",
        options: [
          { id: "q1-1-a", label: "Học càng nhiều giờ càng tốt", isCorrect: false },
          { id: "q1-1-b", label: "Học đều đặn mỗi ngày dù chỉ 15–30 phút", isCorrect: true },
          { id: "q1-1-c", label: "Chỉ học khi có hứng", isCorrect: false },
          { id: "q1-1-d", label: "Học một lần duy nhất trong tuần", isCorrect: false },
        ],
      },
      {
        id: "q1-2",
        type: "multiple_choice",
        text: "Việc ôn lại ngắn 2–3 phút sau khi học giúp gì?",
        options: [
          { id: "q1-2-a", label: "Tốn thêm thời gian không cần thiết", isCorrect: false },
          { id: "q1-2-b", label: "Ghi nhớ lâu hơn", isCorrect: true },
          { id: "q1-2-c", label: "Chỉ dành cho người có trí nhớ kém", isCorrect: false },
          { id: "q1-2-d", label: "Không ảnh hưởng đến kết quả", isCorrect: false },
        ],
      },
      {
        id: "q1-3",
        type: "true_false",
        text: "Xác định mục tiêu rõ ràng trước mỗi buổi học giúp tập trung và hiệu quả hơn.",
        options: [
          { id: "q1-3-t", label: "Đúng", isCorrect: true },
          { id: "q1-3-f", label: "Sai", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "quiz-2",
    title: "Bài kiểm tra cuối khóa - Tiếng Anh nghề nghiệp",
    questions: [
      {
        id: "q2-1",
        type: "multiple_choice",
        text: "Khi chưa nghe rõ câu hỏi trong phỏng vấn, bạn nên nói gì?",
        options: [
          { id: "q2-1-a", label: "I don't know.", isCorrect: false },
          { id: "q2-1-b", label: "Could you repeat that, please?", isCorrect: true },
          { id: "q2-1-c", label: "Next question.", isCorrect: false },
          { id: "q2-1-d", label: "Yes.", isCorrect: false },
        ],
      },
      {
        id: "q2-2",
        type: "multiple_choice",
        text: "Sau buổi phỏng vấn, nên gửi email cảm ơn trong vòng bao lâu?",
        options: [
          { id: "q2-2-a", label: "Trong vòng 1 tuần", isCorrect: false },
          { id: "q2-2-b", label: "Trong vòng 24 giờ", isCorrect: true },
          { id: "q2-2-c", label: "Không cần gửi", isCorrect: false },
          { id: "q2-2-d", label: "Chỉ khi được nhắc", isCorrect: false },
        ],
      },
      {
        id: "q2-3",
        type: "true_false",
        text: "Khi trả lời câu hỏi về kinh nghiệm làm việc, nên dùng thì quá khứ.",
        options: [
          { id: "q2-3-t", label: "Đúng", isCorrect: true },
          { id: "q2-3-f", label: "Sai", isCorrect: false },
        ],
      },
      {
        id: "q2-4",
        type: "multiple_choice",
        text: "CV chuyên nghiệp nên nhấn mạnh điều gì?",
        options: [
          { id: "q2-4-a", label: "Sở thích cá nhân dài dòng", isCorrect: false },
          { id: "q2-4-b", label: "Kinh nghiệm và kỹ năng phù hợp vị trí", isCorrect: true },
          { id: "q2-4-c", label: "Ảnh đại diện lớn", isCorrect: false },
          { id: "q2-4-d", label: "Font chữ càng nhiều loại càng nổi bật", isCorrect: false },
        ],
      },
    ],
  },
];

export function getQuizById(quizId: string): Quiz | undefined {
  return MOCK_QUIZZES.find((q) => q.id === quizId);
}

export function getCourseById(courseId: string): Course | undefined {
  return MOCK_COURSES.find((c) => c.id === courseId);
}

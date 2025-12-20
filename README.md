# 🎓 HỆ THỐNG THI TRẮC NGHIỆM TRỰC TUYẾN (ONLINE QUIZ PLATFORM)

![Python](https://img.shields.io/badge/Python-3.10-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/Frontend-ReactJS-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)

> **Đồ án môn học:** Phát triển Ứng dụng Mã nguồn mở  
> **Giảng viên hướng dẫn:** ThS. Lê Duy Hùng  
> **Năm học:** 2025

---

## 👥 THÀNH VIÊN THỰC HIỆN

| STT | Họ và Tên | Mã Sinh Viên | Vai trò & Nhiệm vụ |
|:---:|:---|:---|:---|
| 1 | **Đặng Hữu Nghĩa** | 23050138 | **Nhóm trưởng (Leader)**<br>• Xây dựng Backend API<br>• Thiết kế Database<br>• Triển khai hệ thống (Render/Vercel) |
| 2 | **Nguyễn Thị Huỳnh Như** | 23050034 | **Thành viên**<br>• Phát triển Frontend ReactJS<br>• Thiết kế giao diện (UI/UX)<br>• Viết báo cáo & Kiểm thử |

---

## 📖 GIỚI THIỆU

**Online Quiz Platform** là hệ thống hỗ trợ tổ chức thi và đánh giá năng lực trực tuyến. Hệ thống giải quyết các hạn chế của phương thức thi truyền thống bằng cách tự động hóa quy trình làm bài, chấm điểm và báo cáo.

**Điểm nổi bật:**
* **Hiệu năng cao:** Backend sử dụng FastAPI xử lý bất đồng bộ.
* **Bảo mật:** Xác thực người dùng qua JWT, mã hóa mật khẩu Bcrypt.
* **Trực quan:** Giao diện ReactJS hiện đại, dễ sử dụng.
* **Tin cậy:** Dữ liệu được lưu trữ an toàn trên PostgreSQL.

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG

### Backend (Server)
* **Core:** Python 3.10, FastAPI.
* **Database:** SQLAlchemy (Async), PostgreSQL.
* **Authentication:** JWT (JSON Web Token), Passlib.
* **Validation:** Pydantic.

### Frontend (Client)
* **Framework:** ReactJS (Vite).
* **Styling:** CSS Modules / Bootstrap.
* **State Management:** React Hooks.
* **API Client:** Axios.

### Triển khai (Deployment)
* **Backend & DB:** Render.
* **Frontend:** Vercel.
* **Source Control:** Git & GitHub.

---

## ✨ TÍNH NĂNG CHI TIẾT

### 1. Phân hệ Sinh viên
* ✅ **Dashboard:** Xem bài thi được giao, bài tập tự luyện.
* ✅ **Làm bài thi:** Giao diện thi tập trung, đồng hồ đếm ngược, tự động nộp khi hết giờ.
* ✅ **Xem kết quả:** Biết điểm ngay lập tức, xem chi tiết đáp án đúng/sai.
* ✅ **Lịch sử:** Theo dõi quá trình học tập.

### 2. Phân hệ Giáo viên/Admin
* ✅ **Ngân hàng câu hỏi:** Thêm/Sửa/Xóa câu hỏi, phân loại độ khó (Dễ/Vừa/Khó).
* ✅ **Quản lý đề thi:** Tạo đề thi, trộn câu hỏi ngẫu nhiên, cấu hình thời gian làm bài.
* ✅ **Quản lý lớp học:** Thêm sinh viên vào lớp, xem danh sách lớp.
* ✅ **Báo cáo:** Thống kê kết quả thi, xuất bảng điểm.

---

## ⚙️ HƯỚNG DẪN CÀI ĐẶT (LOCAL)

### Bước 1: Clone dự án
```bash
git clone [https://github.com/HuynhNhu005/baocaocuoiki.github.io.git](https://github.com/HuynhNhu005/baocaocuoiki.github.io.git)
cd ST7.1
Bước 2: Cài đặt Backend
Bash

cd backend

# Tạo môi trường ảo (Khuyên dùng)
python -m venv venv

# Kích hoạt môi trường ảo:
# Trên Windows:
venv\Scripts\activate
# Trên Mac/Linux:
source venv/bin/activate

# Cài đặt thư viện
pip install -r requirements.txt

# Chạy Server
uvicorn app.main:app --reload
Server sẽ chạy tại: http://localhost:8000

Bước 3: Cài đặt Frontend
Bash

cd ../frontend

# Cài đặt gói node
npm install

# Chạy ứng dụng
npm run dev
Frontend sẽ chạy tại: http://localhost:5173

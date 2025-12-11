-- Giả sử database quizdb đã tồn tại và table questions đã tạo bởi SQLAlchemy.
-- Dùng INSERT qua psql hoặc dùng API để thêm.

-- Dưới đây chỉ là ví dụ JSON choices; PostgreSQL JSON requires proper quoting.
INSERT INTO questions (category, difficulty, title, choices, answer, explanation, active)
VALUES
('Lập trình', 'easy', 'Ngôn ngữ Python dùng để làm gì?', '["Viết script","Chỉnh sửa ảnh","Gõ văn bản","Thiết kế mạch"]', 0, 'Python là ngôn ngữ lập trình, thường dùng để viết script và web app.', true),
('Lập trình', 'medium', 'Kiểu dữ liệu nào trong Python lưu chuỗi ký tự?', '["int","str","list","dict"]', 1, 'str là kiểu ký tự.', true),
('Cơ sở dữ liệu', 'medium', 'SQL dùng để làm gì?', '["Thiết kế giao diện","Truy vấn cơ sở dữ liệu","Quản lý mạng","Xử lý ảnh"]', 1, 'SQL dùng để truy vấn và quản trị DB.', true),
('Mạng', 'easy', 'HTTP là giao thức ở tầng nào?', '["Tầng ứng dụng","Tầng truyền tải","Tầng mạng","Tầng liên kết dữ liệu"]', 0, 'HTTP là giao thức tầng ứng dụng.', true),
('Toán', 'easy', '2 + 3 = ?', '["4","5","6","7"]', 1, '2+3=5', true),
('An toàn thông tin', 'hard', 'Mã hóa bất đối xứng sử dụng gì?', '["Khóa chung","Khóa riêng","Không dùng khóa","Cả A và B"]', 3, 'Mã hóa bất đối xứng dùng cặp khóa công khai và riêng tư.', true),
('Lập trình', 'medium', 'Trong RESTful, phương thức nào để lấy tài nguyên?', '["POST","GET","PUT","DELETE"]', 1, 'GET dùng để lấy tài nguyên.', true),
('Frontend', 'medium', 'React là thư viện cho nền tảng nào?', '["Backend","Di động","Frontend","Hệ điều hành"]', 2, 'React là thư viện frontend.', true),
('Nâng cao', 'hard', 'Trong SQL, JOIN nào lấy tất cả bản ghi từ 2 bảng?', '["INNER JOIN","LEFT JOIN","FULL OUTER JOIN","CROSS JOIN"]', 2, 'FULL OUTER JOIN lấy tất cả.', true),
('Random', 'easy', 'HTML là gì?', '["Ngôn ngữ lập trình","Ngôn ngữ đánh dấu","Ngôn ngữ cơ sở dữ liệu","Hệ điều hành"]', 1, 'HTML là ngôn ngữ đánh dấu.', true);

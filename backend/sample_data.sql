-- Xóa dữ liệu cũ và reset ID về 1
TRUNCATE TABLE questions RESTART IDENTITY CASCADE;

-- Nạp dữ liệu mới (Hơn 60 câu hỏi đa dạng)
INSERT INTO questions (category, difficulty, title, choices, answer, explanation, active) VALUES

-- =======================================================
-- 1. CHỦ ĐỀ: IT (CÔNG NGHỆ THÔNG TIN)
-- =======================================================
-- Dễ (Easy)
('IT', 'easy', 'CSS dùng để làm gì?', '["Định dạng trang web", "Lập trình server", "Quản lý database", "Tạo API"]', 0, 'CSS dùng để tạo kiểu giao diện.', true),
('IT', 'easy', 'JavaScript chạy chủ yếu ở đâu?', '["Server", "Client (trình duyệt)", "Database", "Hệ điều hành"]', 1, 'JavaScript chủ yếu chạy trên trình duyệt.', true),
('IT', 'easy', 'Hệ điều hành nào sau đây là mã nguồn mở?', '["Windows", "Linux", "macOS", "ChromeOS"]', 1, 'Linux là hệ điều hành mã nguồn mở.', true),
('IT', 'easy', 'Thiết bị nào là thiết bị nhập (Input)?', '["Máy in", "Webcam", "Màn hình", "Loa"]', 1, 'Webcam nhận dữ liệu vào.', true),
('IT', 'easy', 'CSDL viết tắt của từ gì?', '["Cấu trúc dữ liệu", "Cơ sở dữ liệu", "Chương trình dữ liệu", "Cảm biến dữ liệu"]', 1, 'Cơ sở dữ liệu.', true),
('IT', 'easy', 'PNG là định dạng gì?', '["Ảnh", "Video", "Âm thanh", "Tài liệu"]', 0, 'PNG là định dạng ảnh.', true),
('IT', 'easy', 'Bit là gì?', '["Đơn vị đo tốc độ", "Đơn vị nhỏ nhất của dữ liệu", "Một loại file", "Một kiểu CPU"]', 1, 'Bit là đơn vị nhỏ nhất.', true),
('IT', 'easy', 'URL dùng để làm gì?', '["Định vị 1 trang web", "Định dạng ảnh", "Giải nén file", "Tăng tốc mạng"]', 0, 'URL xác định địa chỉ web.', true),
('IT', 'easy', 'Google là công cụ gì?', '["Trình duyệt", "Công cụ tìm kiếm", "Mạng xã hội", "Hệ điều hành"]', 1, 'Google Search.', true),
('IT', 'easy', 'Excel thuộc bộ phần mềm nào?', '["Microsoft Office", "Adobe", "Autodesk", "Google"]', 0, 'Excel thuộc Office.', true),
('IT', 'easy', 'USB dùng để làm gì?', '["Lưu trữ dữ liệu", "Soạn thảo văn bản", "Tăng tốc CPU", "Kết nối hình ảnh"]', 0, 'USB dùng lưu trữ.', true),
('IT', 'easy', 'Wi-Fi là viết tắt của?', '["Wireless Fidelity", "Wide Fire", "Wire Free", "Wi Digital"]', 0, 'Wireless Fidelity.', true),
('IT', 'easy', 'Trình duyệt nào sau đây thuộc Google?', '["Chrome", "Safari", "Firefox", "Cốc Cốc"]', 0, 'Google Chrome.', true),
('IT', 'easy', 'Facebook thuộc loại hình gì?', '["Game", "Mạng xã hội", "Hệ điều hành", "Phần cứng"]', 1, 'Facebook là mạng xã hội.', true),
('IT', 'easy', 'RAM nhanh hơn hay chậm hơn SSD?', '["Nhanh hơn", "Chậm hơn"]', 0, 'RAM nhanh hơn SSD.', true),

-- Trung bình (Medium)
('IT', 'medium', 'MySQL là dạng CSDL gì?', '["Quan hệ", "Phi quan hệ", "Đồ thị", "Văn bản"]', 0, 'MySQL là RDBMS.', true),
('IT', 'medium', 'Which operator is used for equality in JavaScript?', '["=", "==", "===", "=>"]', 2, '=== so sánh cả kiểu và giá trị.', true),
('IT', 'medium', 'SSH dùng để làm gì?', '["Truy cập server từ xa", "Lưu file", "Nén dữ liệu", "Viết website"]', 0, 'SSH dùng điều khiển server.', true),
('IT', 'medium', 'API dùng để làm gì?', '["Giao tiếp giữa các hệ thống", "Thiết kế frontend", "Lưu trữ hình ảnh", "Phát nhạc"]', 0, 'API là giao diện lập trình ứng dụng.', true),
('IT', 'medium', 'Object-Oriented Programming là viết tắt của?', '["OOP", "OPP", "OPO", "PPO"]', 0, 'OOP: Lập trình hướng đối tượng.', true),
('IT', 'medium', 'MongoDB là CSDL gì?', '["SQL", "NoSQL", "Tệp văn bản", "Đồ thị"]', 1, 'MongoDB là NoSQL.', true),
('IT', 'medium', 'Framework nào dùng cho backend?', '["Laravel", "React", "Vue", "Tailwind"]', 0, 'Laravel dùng cho backend PHP.', true),
('IT', 'medium', 'React thuộc loại gì?', '["Framework", "Library", "Hệ điều hành", "Trình duyệt"]', 1, 'React là thư viện JS.', true),
('IT', 'medium', 'Thuật toán nào dùng tìm kiếm nhị phân?', '["Danh sách sắp xếp", "Danh sách không sắp xếp"]', 0, 'Binary Search cần danh sách đã sắp.', true),
('IT', 'medium', 'IDE dùng để làm gì?', '["Viết và chạy code", "Xử lý ảnh", "Chơi game", "Điều khiển phần cứng"]', 0, 'IDE hỗ trợ lập trình.', true),
('IT', 'medium', 'JSON có dạng gì?', '["Key-Value", "Hình ảnh", "Âm thanh", "Video"]', 0, 'JSON là cấu trúc key-value.', true),
('IT', 'medium', 'JWT dùng trong?', '["Xác thực", "Lưu dữ liệu", "Thiết kế UI", "Tăng tốc CPU"]', 0, 'JWT dùng để xác thực.', true),
('IT', 'medium', 'Cổng FTP mặc định?', '["20-21", "22", "80", "110"]', 0, 'FTP dùng port 20 và 21.', true),
('IT', 'medium', 'AI viết tắt của?', '["Artificial Intelligence", "Auto Input", "Advanced Internet", "Audio Integration"]', 0, 'Trí tuệ nhân tạo.', true),
('IT', 'medium', 'HTML5 thêm thẻ gì mới?', '["<video>", "<blink>", "<marquee>", "<strike>"]', 0, 'HTML5 hỗ trợ <video>.', true),

-- Khó (Hard)
('IT', 'hard', 'Big-O của Merge Sort là?', '["O(n)", "O(n log n)", "O(n^2)", "O(log n)"]', 1, 'Merge Sort là O(n log n).', true),
('IT', 'hard', 'Protocol nào dùng để gửi email?', '["IMAP", "SMTP", "POP3", "FTP"]', 1, 'SMTP gửi email.', true),
('IT', 'hard', 'CPU Scheduling: Round Robin ưu tiên điều gì?', '["Thời gian đáp ứng", "Thời gian chờ", "Công việc lớn", "Công việc nhỏ"]', 0, 'RR tối ưu responsive.', true),
('IT', 'hard', 'ACID là thuộc tính của?', '["Database Transaction", "API", "Cache", "CPU"]', 0, 'ACID đảm bảo giao dịch.', true),
('IT', 'hard', 'SHA-256 thuộc loại thuật toán gì?', '["Mã hóa đối xứng", "Băm (Hash)", "Nén", "Nén ảnh"]', 1, 'SHA-256 là thuật toán băm.', true),
('IT', 'hard', 'Cơ chế của DNS hoạt động dựa vào?', '["Phân giải tên miền", "Mã hóa dữ liệu"]', 0, 'DNS phân giải domain → IP.', true),
('IT', 'hard', 'Virtual Memory hoạt động bằng?', '["Swap", "Process", "Thread"]', 0, 'Virtual Memory dùng Swap.', true),
('IT', 'hard', 'CAP Theorem: Hệ CSDL phân tán chọn được mấy thuộc tính?', '["1", "2", "3"]', 1, 'Chỉ được chọn 2/3: Consistency, Availability, Partition Tolerance.', true),
('IT', 'hard', 'Docker image là gì?', '["Snapshot", "Template cho container", "CSDL"]', 1, 'Image là template.', true),
('IT', 'hard', 'Kubernetes dùng để?', '["Orchestrate container", "Viết API"]', 0, 'K8s dùng quản lý container.', true),
('IT', 'hard', 'Redis lưu dữ liệu kiểu gì?', '["In-memory", "On Disk"]', 0, 'Redis là in-memory.', true),
('IT', 'hard', 'HTTPS dùng thuật toán mã hóa nào?', '["SSL/TLS"]', 0, 'Sử dụng TLS.', true),
('IT', 'hard', 'GraphQL khác REST ở điểm nào?', '["Client chủ động chọn dữ liệu"]', 0, 'GraphQL cho phép client chọn field.', true),
('IT', 'hard', 'IPv6 dài bao nhiêu bit?', '["32", "64", "128", "256"]', 2, 'IPv6 = 128 bit.', true),
('IT', 'hard', 'Bảng băm (Hash Table) có độ phức tạp trung bình?', '["O(1)", "O(log n)", "O(n)"]', 0, 'TrTrung bình O(1).', true),


-- =======================================================
-- 2. CHỦ ĐỀ: TOÁN HỌC (MATH)
-- =======================================================
-- Dễ
('Math', 'easy', 'Kết quả của phép tính: 15 + 27 = ?', '["32", "42", "45", "37"]', 1, '15 + 27 = 42.', true),
('Math', 'easy', 'Số nào sau đây là số nguyên tố?', '["4", "9", "11", "15"]', 2, '11 là số nguyên tố.', true),
('Math', 'easy', 'Một hình vuông có cạnh bằng 5cm. Chu vi là bao nhiêu?', '["15cm", "20cm", "25cm", "10cm"]', 1, 'Chu vi = 4 × 5 = 20.', true),
('Math', 'easy', 'Kết quả của 7 bình phương (7^2) là?', '["14", "21", "49", "56"]', 2, '7 × 7 = 49.', true),
('Math', 'easy', 'Góc bẹt có số đo bao nhiêu độ?', '["90 độ", "180 độ", "360 độ", "45 độ"]', 1, 'Góc bẹt bằng 180°.', true),

('Math', 'easy', 'Kết quả của 9 × 6 là?', '["45", "54", "56", "64"]', 1, '9 × 6 = 54.', true),
('Math', 'easy', 'Số lớn nhất trong các số sau: 12, 9, 15, 7?', '["12", "9", "15", "7"]', 2, '15 là số lớn nhất.', true),
('Math', 'easy', 'Giá trị của √49 là?', '["5", "6", "7", "8"]', 2, '√49 = 7.', true),
('Math', 'easy', 'Tổng 100 + 250 bằng?', '["250", "300", "350", "400"]', 2, '100 + 250 = 350.', true),
('Math', 'easy', 'Số chẵn trong nhóm sau: 13, 17, 22, 29?', '["13", "17", "22", "29"]', 2, '22 là số chẵn.', true),

('Math', 'easy', 'Kết quả của 5 × 8 là?', '["30", "35", "40", "45"]', 2, '5 × 8 = 40.', true),
('Math', 'easy', 'Số nhỏ nhất trong các số: 3, 8, 1, 5?', '["3", "8", "1", "5"]', 2, '1 nhỏ nhất.', true),
('Math', 'easy', 'Giá trị của 3³ là?', '["9", "18", "27", "81"]', 2, '3³ = 27.', true),
('Math', 'easy', 'Chu vi hình chữ nhật có chiều dài 8 và rộng 4?', '["16", "20", "24", "28"]', 2, 'P = (8+4)*2 = 24.', true),
('Math', 'easy', 'Một giờ có bao nhiêu phút?', '["30", "45", "60", "90"]', 2, '1 giờ = 60 phút.', true),

('Math', 'easy', 'Tìm x: x + 10 = 25', '["10", "15", "20", "25"]', 1, 'x = 25 - 10 = 15.', true),
('Math', 'easy', 'Kết quả của 100 - 35 là?', '["55", "60", "65", "70"]', 2, '100 - 35 = 65.', true),
('Math', 'easy', 'Số nào là bội của 3?', '["7", "9", "11", "14"]', 1, '9 là bội của 3.', true),
('Math', 'easy', 'Diện tích hình vuông cạnh 6?', '["12", "24", "30", "36"]', 3, 'S = 6 × 6 = 36.', true),
('Math', 'easy', 'Kết quả 2 × (3 + 4) = ?', '["10", "12", "14", "16"]', 2, '2*(3+4)=14.', true),

-- Trung bình
('Math', 'medium', 'Giải phương trình: 2x - 8 = 0', '["x = 2", "x = 4", "x = -4", "x = 8"]', 1, '2x = 8 => x = 4.', true),
('Math', 'medium', 'Căn bậc hai của 144 là?', '["10", "11", "12", "14"]', 2, '√144 = 12.', true),
('Math', 'medium', 'Diện tích hình tròn có r = 10?', '["10π", "20π", "100π", "50π"]', 2, 'S = πr² = 100π.', true),
('Math', 'medium', 'Số nhị phân của 5 là?', '["100", "101", "110", "111"]', 1, '5 = 101₂.', true),
('Math', 'medium', 'Tam giác 3–4–5 là loại gì?', '["Đều", "Cân", "Vuông", "Tù"]', 2, '3²+4²=5² => vuông.', true),

('Math', 'medium', 'log10(1000) bằng?', '["1", "2", "3", "4"]', 2, '10³ = 1000.', true),
('Math', 'medium', 'Giải x: 3x + 9 = 0', '["–3", "–2", "1", "3"]', 1, '3x = –9 => x = –3.', true),
('Math', 'medium', 'Đồ thị của y = x² là dạng?', '["Parabol", "Đường thẳng", "Hàm bậc 3", "Hiperbol"]', 0, 'y=x² là parabol.', true),
('Math', 'medium', 'Giá trị của 2⁵?', '["16", "32", "48", "64"]', 1, '2⁵ = 32.', true),
('Math', 'medium', 'Giải hệ: x+y=10, x−y=2', '["(6,4)", "(7,3)", "(8,2)", "(5,5)"]', 0, 'x=6,y=4.', true),

('Math', 'medium', 'Tìm đạo hàm của x² + 3x', '["2x+3", "x+3", "2x", "x²"]', 0, 'D(x²+3x)=2x+3.', true),
('Math', 'medium', 'Tính tổng 1+2+...+10', '["45", "50", "55", "60"]', 2, 'n(n+1)/2 = 55.', true),
('Math', 'medium', 'Thể tích hình lập phương cạnh 3?', '["9", "18", "27", "36"]', 2, '3³=27.', true),
('Math', 'medium', 'Giải bất phương trình: x - 3 > 2', '["x > 1", "x > 3", "x > 5", "x > 0"]', 2, 'x > 5.', true),
('Math', 'medium', 'cos(60°) bằng?', '["0", "0.5", "1", "√3/2"]', 1, 'cos60°=0.5.', true),

('Math', 'medium', 'Tính 7! / 5!', '["14", "42", "210", "720"]', 2, '7! / 5! = 7×6 = 42.', true),
('Math', 'medium', 'Giải: |x - 4| = 2', '["2 và 6", "1 và 7", "4 và 2", "0 và 4"]', 0, 'x=2 hoặc x=6.', true),
('Math', 'medium', 'Tìm min của hàm y=x²-4x+5', '["0", "1", "2", "3"]', 3, 'min= (–b/2a)=2.', true),
('Math', 'medium', 'Hệ số góc đường thẳng y = 3x + 1?', '["1", "2", "3", "4"]', 2, 'hệ số góc = 3.', true),
('Math', 'medium', 'Chu vi tam giác cạnh 5,6,7?', '["15","16","17","18"]', 3, '5+6+7=18.', true),

-- Khó
('Math', 'hard', 'Đạo hàm của f(x)=x^3?', '["3x","x^2","3x^2","3x^3"]', 2, '(x^n)''=n x^(n-1).', true),
('Math', 'hard', 'log₂(1024)=?', '["8","9","10","12"]', 2, '2¹⁰=1024.', true),
('Math', 'hard', 'sin(90°)=?', '["0","0.5","1","-1"]', 2, 'sin90°=1.', true),
('Math', 'hard', 'i² bằng?', '["1","-1","0","i"]', 1, 'i²=-1.', true),
('Math', 'hard', '∫ 2x dx từ 0 đến 2 = ?', '["2","4","6","8"]', 1, 'KQ=4.', true),

('Math', 'hard', 'Giới hạn lim(x→0) sinx/x = ?', '["0","1","∞","Không tồn tại"]', 1, 'Giới hạn = 1.', true),
('Math', 'hard', 'Tính đạo hàm ln(x²)', '["1/x","2/x","2x","x"]', 1, 'ln(x²)=2ln(x).', true),
('Math', 'hard', 'Ma trận 2x2 có bao nhiêu phần tử?', '["2","4","6","8"]', 1, '2×2=4.', true),
('Math', 'hard', 'Tìm nghiệm của x³=27', '["2","3","4","5"]', 1, 'x=3.', true),
('Math', 'hard', 'Tích phân ∫(1/x) dx = ?', '["ln|x|","1/x","x","x²"]', 0, '∫1/x dx = ln|x|.', true),

('Math', 'hard', 'Giải 2^(x+1)=32', '["3","4","5","6"]', 1, '2^(x+1)=2⁵ => x=4.', true),
('Math', 'hard', 'Tìm đạo hàm e^{3x}', '["e^{3x}","3e^{3x}","x e^{3x}","9 e^{3x}"]', 1, 'd/dx e^{kx}=k e^{kx}.', true),
('Math', 'hard', 'Hàm số nào đồng biến?', '["-x","x^2","x^3","1/x"]', 2, 'x³ đồng biến.', true),
('Math', 'hard', 'Giới hạn lim(x→∞) 1/x = ?', '["1","0","∞","Không tồn tại"]', 1, '→0.', true),
('Math', 'hard', 'Giải: ln(x)=2', '["x=e","x=e^2","x=4","x=2"]', 1, 'x=e².', true),

('Math', 'hard', 'Định thức ma trận [[2,1],[3,4]]?', '["5","-5","8","7"]', 1, '2×4 - 1×3 = 5.', true),
('Math', 'hard', 'cos(0°)=?', '["0","1","-1","0.5"]', 1, 'cos0°=1.', true),
('Math', 'hard', 'Giải: |2x-5|=7', '["x=1 hoặc x=6", "x=2 hoặc 4", "x=-1 hoặc 6", "x=5 hoặc 7"]', 2, '2x-5=±7.', true),
('Math', 'hard', 'Số nghiệm của x⁴=16?', '["1","2","3","4"]', 3, '±2 và ±2i.', true),
('Math', 'hard', 'Số phức 3+4i có mô-đun?', '["3","4","5","7"]', 2, '√(3²+4²)=5.', true),


-- =======================================================
-- 3. CHỦ ĐỀ: ĐỊA LÝ (GEOGRAPHY)
-- =======================================================
-- Dễ
('Geography', 'easy', 'Thủ đô của Việt Nam là gì?', '["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Huế"]', 1, 'Hà Nội là thủ đô.', true),
('Geography', 'easy', 'Nước nào có diện tích lớn nhất thế giới?', '["Mỹ", "Trung Quốc", "Nga", "Canada"]', 2, 'Nga có diện tích lớn nhất.', true),
('Geography', 'easy', 'Lục địa nào là lục địa lạnh nhất?', '["Châu Á", "Châu Âu", "Châu Nam Cực", "Châu Bắc Cực"]', 2, 'Nam Cực là nơi lạnh nhất.', true),
('Geography', 'easy', 'Sông nào dài nhất Việt Nam?', '["Sông Hồng", "Sông Đồng Nai", "Sông Mê Kông", "Sông Đà"]', 2, 'Sông Mê Kông.', true),
('Geography', 'easy', 'Thủ đô của Nhật Bản là?', '["Seoul", "Bắc Kinh", "Tokyo", "Bangkok"]', 2, 'Tokyo.', true),

-- 15 câu dễ bổ sung
('Geography', 'easy', 'Nước nào được gọi là “đất nước mặt trời mọc”?', '["Hàn Quốc", "Nhật Bản", "Trung Quốc", "Mông Cổ"]', 1, 'Nhật Bản.', true),
('Geography', 'easy', 'Thủ đô của Hàn Quốc là?', '["Busan", "Seoul", "Incheon", "Daegu"]', 1, 'Seoul.', true),
('Geography', 'easy', 'Châu lục nào có diện tích lớn nhất?', '["Châu Á", "Châu Phi", "Châu Âu", "Châu Mỹ"]', 0, 'Châu Á lớn nhất.', true),
('Geography', 'easy', 'Đại dương nào lớn nhất thế giới?', '["Ấn Độ Dương", "Bắc Băng Dương", "Thái Bình Dương", "Đại Tây Dương"]', 2, 'Thái Bình Dương.', true),
('Geography', 'easy', 'Sa mạc Sahara thuộc châu lục nào?', '["Châu Á", "Châu Phi", "Châu Mỹ", "Châu Úc"]', 1, 'Thuộc châu Phi.', true),
('Geography', 'easy', 'Thác nước Niagara nằm giữa Mỹ và quốc gia nào?', '["Mexico", "Canada", "Brazil", "Argentina"]', 1, 'Giữa Mỹ và Canada.', true),
('Geography', 'easy', 'Núi Phú Sĩ thuộc quốc gia nào?', '["Trung Quốc", "Nhật Bản", "Hàn Quốc", "Indonesia"]', 1, 'Nhật Bản.', true),
('Geography', 'easy', 'Thủ đô của Lào là?', '["Vientiane", "Phnom Penh", "Bangkok", "Yangon"]', 0, 'Vientiane.', true),
('Geography', 'easy', 'Quốc gia nào có nhiều đảo nhất thế giới?', '["Philippines", "Indonesia", "Maldives", "Thái Lan"]', 1, 'Indonesia.', true),
('Geography', 'easy', 'Địa điểm du lịch nổi tiếng Vạn Lý Trường Thành nằm ở đâu?', '["Hàn Quốc", "Nhật Bản", "Trung Quốc", "Mông Cổ"]', 2, 'Trung Quốc.', true),
('Geography', 'easy', 'Biển nào nằm giữa Việt Nam và Philippines?', '["Biển Caribbe", "Biển Đông", "Biển Đỏ", "Biển Đen"]', 1, 'Biển Đông.', true),
('Geography', 'easy', 'Nước nào có lá cờ có hình lá phong?', '["Canada", "Anh", "Mỹ", "Úc"]', 0, 'Canada.', true),
('Geography', 'easy', 'Thủ đô của Thái Lan là?', '["Bangkok", "Chiang Mai", "Phuket", "Pattaya"]', 0, 'Bangkok.', true),
('Geography', 'easy', 'Châu lục nhỏ nhất thế giới là?', '["Châu Đại Dương", "Châu Âu", "Châu Nam Cực", "Châu Phi"]', 0, 'Châu Đại Dương.', true),
('Geography', 'easy', 'Núi Bà Đen nằm ở tỉnh nào của Việt Nam?', '["Tây Ninh", "Đồng Nai", "Cần Thơ", "An Giang"]', 0, 'Tây Ninh.', true),
('Geography', 'easy', 'Quốc gia nào nổi tiếng với kim tự tháp?', '["Iraq", "Iran", "Ai Cập", "Arab Saudi"]', 2, 'Ai Cập.', true),
('Geography', 'easy', 'Sông Hồng chảy qua Hà Nội và thành phố nào?', '["Hải Phòng", "Lào Cai", "Đà Nẵng", "Huế"]', 1, 'Lào Cai.', true),
('Geography', 'easy', 'Hồ Gươm nằm ở đâu?', '["Hà Nội", "Hải Phòng", "Nam Định", "Ninh Bình"]', 0, 'Hà Nội.', true),

-- Trung bình
('Geography', 'medium', 'Quốc gia nào có dân số đông nhất thế giới (2023)?', '["Trung Quốc", "Ấn Độ", "Mỹ", "Indonesia"]', 1, 'Ấn Độ đã vượt Trung Quốc.', true),
('Geography', 'medium', 'Đỉnh núi cao nhất thế giới nằm ở đâu?', '["Dãy Andes", "Dãy Alps", "Dãy Himalaya", "Dãy Rocky"]', 2, 'Đỉnh Everest thuộc dãy Himalaya.', true),
('Geography', 'medium', 'Biển Đông tiếp giáp với đại dương nào?', '["Ấn Độ Dương", "Thái Bình Dương", "Đại Tây Dương", "Bắc Băng Dương"]', 1, 'Thái Bình Dương.', true),
('Geography', 'medium', 'Nước nào có hình dáng giống chiếc ủng?', '["Pháp", "Đức", "Ý (Italy)", "Anh"]', 2, 'Ý có hình chiếc ủng.', true),
('Geography', 'medium', 'Sa mạc lớn nhất thế giới là?', '["Sahara", "Gobi", "Kalahari", "Nam Cực"]', 3, 'Nam Cực là sa mạc lớn nhất.', true),

-- 15 câu trung bình bổ sung
('Geography', 'medium', 'Sông Amazon chảy qua bao nhiêu quốc gia?', '["3", "5", "7", "9"]', 1, 'Chảy qua 5 quốc gia.', true),
('Geography', 'medium', 'Tây Tạng thuộc quốc gia nào?', '["Ấn Độ", "Nepal", "Trung Quốc", "Bhutan"]', 2, 'Tây Tạng thuộc Trung Quốc.', true),
('Geography', 'medium', 'Nước nào có diện tích nhỏ nhất thế giới?', '["Monaco", "Malta", "Vatican", "Liechtenstein"]', 2, 'Vatican nhỏ nhất.', true),
('Geography', 'medium', 'Hồ Ba Bể nằm ở tỉnh nào?', '["Bắc Kạn", "Lạng Sơn", "Thái Nguyên", "Phú Thọ"]', 0, 'Bắc Kạn.', true),
('Geography', 'medium', 'Vịnh Hạ Long thuộc vùng nào?', '["Tây Bắc", "Đông Bắc", "Đồng bằng Sông Hồng", "Bắc Trung Bộ"]', 1, 'Đông Bắc.', true),
('Geography', 'medium', 'Núi Everest nằm giữa Nepal và nước nào?', '["Trung Quốc", "Ấn Độ", "Pakistan", "Mông Cổ"]', 0, 'Giữa Nepal và Trung Quốc.', true),
('Geography', 'medium', 'Quốc gia nào có nhiều núi lửa nhất?', '["Nhật Bản", "Indonesia", "Philippines", "New Zealand"]', 1, 'Indonesia.', true),
('Geography', 'medium', 'Sông Mekong bắt nguồn từ quốc gia nào?', '["Trung Quốc", "Lào", "Myanmar", "Thái Lan"]', 0, 'Bắt nguồn từ Trung Quốc.', true),
('Geography', 'medium', 'Thủ đô của New Zealand là?', '["Auckland", "Wellington", "Christchurch", "Hamilton"]', 1, 'Wellington.', true),
('Geography', 'medium', 'Châu Phi có bao nhiêu quốc gia?', '["44", "50", "54", "60"]', 2, 'Châu Phi có 54 quốc gia.', true),
('Geography', 'medium', 'Biển Đen nằm giữa châu lục nào?', '["Châu Á và Châu Âu", "Châu Á và Châu Phi", "Châu Mỹ và Châu Âu", "Châu Úc và Châu Á"]', 0, 'Giữa Á và Âu.', true),
('Geography', 'medium', 'Bang Texas thuộc vùng nào của Mỹ?', '["Đông Bắc", "Tây Nam", "Tây Bắc", "Đông Nam"]', 1, 'Texas thuộc Tây Nam.', true),
('Geography', 'medium', 'Quốc gia nào có đường bờ biển dài nhất?', '["Nga", "Canada", "Úc", "Mỹ"]', 1, 'Canada dài nhất.', true),
('Geography', 'medium', 'Đảo lớn nhất Việt Nam là?', '["Côn Đảo", "Cát Bà", "Phú Quốc", "Lý Sơn"]', 2, 'Phú Quốc.', true),
('Geography', 'medium', 'Vùng nào của Việt Nam có nhiều hang động nhất?', '["Tây Bắc", "Bắc Trung Bộ", "Nam Trung Bộ", "Tây Nguyên"]', 1, 'Bắc Trung Bộ (Phong Nha).', true),

-- Khó
('Geography', 'hard', 'Dòng sông nào dài nhất thế giới?', '["Sông Amazon", "Sông Nile", "Sông Dương Tử", "Sông Mississippi"]', 1, 'Nile (Amazon đang tranh chấp).', true),
('Geography', 'hard', 'Hồ nước ngọt lớn nhất thế giới theo thể tích?', '["Hồ Superior", "Hồ Victoria", "Hồ Baikal", "Hồ Michigan"]', 2, 'Hồ Baikal.', true),
('Geography', 'hard', 'Quốc gia nào nằm trên cả Châu Á và Châu Âu?', '["Ai Cập", "Thổ Nhĩ Kỳ", "Nga", "Cả B và C"]', 3, 'Cả Thổ Nhĩ Kỳ và Nga.', true),
('Geography', 'hard', 'Vĩ tuyến 17 là ranh giới lịch sử của nước nào?', '["Hàn Quốc - Triều Tiên", "Việt Nam", "Đức", "Yemen"]', 1, 'Chia cắt Việt Nam.', true),
('Geography', 'hard', 'Thủ đô của Úc là gì?', '["Sydney", "Melbourne", "Canberra", "Perth"]', 2, 'Canberra.', true),

-- 15 câu khó bổ sung
('Geography', 'hard', 'Đỉnh núi cao nhất châu Âu là?', '["Elbrus", "Mont Blanc", "Matterhorn", "Olympus"]', 0, 'Elbrus.', true),
('Geography', 'hard', 'Sa mạc Atacama thuộc quốc gia nào?', '["Peru", "Chile", "Argentina", "Bolivia"]', 1, 'Chile.', true),
('Geography', 'hard', 'Vùng lãnh thổ Greenland thuộc nước nào?', '["Canada", "Mỹ", "Iceland", "Đan Mạch"]', 3, 'Đan Mạch.', true),
('Geography', 'hard', 'Biển nào mặn nhất thế giới?', '["Biển Chết", "Biển Đỏ", "Biển Aral", "Biển Đen"]', 0, 'Biển Chết.', true),
('Geography', 'hard', 'Quốc gia không giáp bất kỳ đại dương nào?', '["Mông Cổ", "Nam Phi", "Mexico", "Nhật Bản"]', 0, 'Mông Cổ.', true),
('Geography', 'hard', 'Châu lục nào không có sông nào chảy qua?', '["Châu Nam Cực", "Châu Phi", "Châu Á", "Châu Úc"]', 0, 'Nam Cực.', true),
('Geography', 'hard', 'Thác nước Victoria nằm giữa Zambia và quốc gia nào?', '["Nam Phi", "Kenya", "Zimbabwe", "Botswana"]', 2, 'Zimbabwe.', true),
('Geography', 'hard', 'Nơi nào được gọi là “nóc nhà thế giới”?', '["Tây Tạng", "Nepal", "Himalaya", "Pakistan"]', 0, 'Tây Tạng.', true),
('Geography', 'hard', 'Quốc gia nào có số múi giờ nhiều nhất?', '["Nga", "Mỹ", "Canada", "Pháp"]', 3, 'Pháp (bao gồm lãnh thổ hải ngoại).', true),
('Geography', 'hard', 'Eo biển Malacca nằm giữa Malaysia và nước nào?', '["Thái Lan", "Indonesia", "Singapore", "Philippines"]', 1, 'Indonesia.', true),
('Geography', 'hard', 'Thành phố nào có dân số lớn nhất thế giới (2024)?', '["Tokyo", "Delhi", "Thượng Hải", "Mexico City"]', 0, 'Tokyo.', true),
('Geography', 'hard', 'Trung Đông nằm chủ yếu ở châu lục nào?', '["Châu Á", "Châu Phi", "Châu Âu", "Cả A và B"]', 3, 'Một phần châu Á và châu Phi.', true),
('Geography', 'hard', 'Dòng biển Gulf Stream thuộc đại dương nào?', '["Đại Tây Dương", "Thái Bình Dương", "Ấn Độ Dương", "Bắc Băng Dương"]', 0, 'Đại Tây Dương.', true),
('Geography', 'hard', 'Biển Sargasso khác biệt ở điểm nào?', '["Không tiếp giáp đất liền", "Mặn thấp", "Mực nước thấp", "Lạnh nhất thế giới"]', 0, 'Không tiếp giáp đất liền.', true),
('Geography', 'hard', 'Nước nào có độ cao trung bình lớn nhất?', '["Nepal", "Bhutan", "Tây Tạng/Trung Quốc", "Kyrgyzstan"]', 2, 'Tây Tạng cao nhất.', true),


-- =======================================================
-- 4. CHỦ ĐỀ: KHOA HỌC (SCIENCE)
-- =======================================================
-- Dễ
('Science', 'easy', 'Nước sôi ở bao nhiêu độ C (áp suất thường)?', '["90", "100", "110", "80"]', 1, '100 độ C.', true),
('Science', 'easy', 'Hành tinh nào gần Mặt Trời nhất?', '["Sao Kim", "Sao Hỏa", "Sao Thủy", "Trái Đất"]', 2, 'Sao Thủy.', true),
('Science', 'easy', 'Con người hít khí gì để sống?', '["Oxy", "Nitơ", "Cacbonic", "Hydro"]', 0, 'Oxy (O2).', true),
('Science', 'easy', 'Cá thở bằng gì?', '["Phổi", "Mang", "Da", "Miệng"]', 1, 'Cá thở bằng mang.', true),
('Science', 'easy', 'Mặt Trời mọc ở hướng nào?', '["Đông", "Tây", "Nam", "Bắc"]', 0, 'Đông.', true),

-- 15 câu Easy bổ sung
('Science', 'easy', 'Nước đóng băng ở bao nhiêu độ C?', '["0", "32", "100", "-1"]', 0, '0 độ C.', true),
('Science', 'easy', 'Nguyên tố hóa học O là gì?', '["Oxy", "Vàng", "Sắt", "Hydro"]', 0, 'Oxy.', true),
('Science', 'easy', 'Khí Nitơ chiếm bao nhiêu % trong không khí?', '["78%", "21%", "1%", "50%"]', 0, 'Khoảng 78%.', true),
('Science', 'easy', 'Sao Kim được gọi là hành tinh gì?', '["Hành tinh Đỏ", "Hành tinh Xanh", "Hành tinh Sao Kim", "Hành tinh Hỏa"]', 2, 'Hành tinh Sao Kim.', true),
('Science', 'easy', 'Máy tính đo áp suất khí quyển là gì?', '["Barometer", "Thermometer", "Hygrometer", "Altimeter"]', 0, 'Barometer.', true),
('Science', 'easy', 'Con người có bao nhiêu giác quan cơ bản?', '["4", "5", "6", "7"]', 1, '5 giác quan.', true),
('Science', 'easy', 'Hệ mặt trời có bao nhiêu hành tinh chính?', '["7", "8", "9", "10"]', 1, '8 hành tinh.', true),
('Science', 'easy', 'Công thức hóa học của nước?', '["H2O", "CO2", "NaCl", "O2"]', 0, 'H2O.', true),
('Science', 'easy', 'Mặt trăng quay quanh hành tinh nào?', '["Trái Đất", "Sao Hỏa", "Sao Thủy", "Sao Kim"]', 0, 'Trái Đất.', true),
('Science', 'easy', 'Người ta dùng kính hiển vi để làm gì?', '["Quan sát vật nhỏ", "Đo nhiệt độ", "Đo khối lượng", "Lấy mẫu đất"]', 0, 'Quan sát vật nhỏ.', true),
('Science', 'easy', 'Hiện tượng cầu vồng xuất hiện khi nào?', '["Trời mưa", "Khi có ánh sáng chiếu qua nước", "Khi gió mạnh", "Đêm trăng tròn"]', 1, 'Ánh sáng chiếu qua nước.', true),
('Science', 'easy', 'Mặt Trời thuộc loại sao gì?', '["Sao lùn trắng", "Sao lùn vàng", "Siêu sao đỏ", "Sao neutron"]', 1, 'Sao lùn vàng.', true),
('Science', 'easy', 'Nguyên tố hóa học Au là gì?', '["Vàng", "Bạc", "Đồng", "Sắt"]', 0, 'Vàng.', true),
('Science', 'easy', 'Hệ thần kinh trung ương bao gồm?', '["Não và tủy sống", "Não và tim", "Tủy sống và phổi", "Tim và não"]', 0, 'Não và tủy sống.', true),
('Science', 'easy', 'Loài người phát hiện lửa từ thời kỳ nào?', '["Đồ đá cũ", "Đồ đá mới", "Đồ đồng", "Đồ sắt"]', 0, 'Thời kỳ Đồ đá cũ.', true),

-- Trung bình
('Science', 'medium', 'Công thức hóa học của muối ăn là?', '["H2O", "CO2", "NaCl", "HCl"]', 2, 'NaCl.', true),
('Science', 'medium', 'Vận tốc ánh sáng xấp xỉ bao nhiêu?', '["300.000 km/s", "150.000 km/s", "1000 km/s", "30.000 km/s"]', 0, 'Khoảng 300.000 km/s.', true),
('Science', 'medium', 'Kim loại nào dẫn điện tốt nhất?', '["Vàng", "Đồng", "Bạc", "Nhôm"]', 2, 'Bạc.', true),
('Science', 'medium', 'Hành tinh nào được gọi là Hành tinh Đỏ?', '["Sao Mộc", "Sao Hỏa", "Sao Thổ", "Sao Kim"]', 1, 'Sao Hỏa.', true),
('Science', 'medium', 'Ai là người phát minh ra bóng đèn điện?', '["Nikola Tesla", "Thomas Edison", "Albert Einstein", "Alexander Bell"]', 1, 'Thomas Edison.', true),

-- 15 câu Medium bổ sung
('Science', 'medium', 'Đơn vị đo cường độ dòng điện là gì?', '["Volt", "Ampere", "Ohm", "Watt"]', 1, 'Ampere.', true),
('Science', 'medium', 'Chất nào làm cho giấy cháy?', '["Oxy", "Hydro", "Nitơ", "Carbon"]', 0, 'Oxy.', true),
('Science', 'medium', 'Quá trình quang hợp xảy ra ở bộ phận nào của cây?', '["Rễ", "Thân", "Lá", "Hoa"]', 2, 'Ở lá.', true),
('Science', 'medium', 'Nhiệt lượng cần để làm nóng 1kg nước 1°C là bao nhiêu?', '["1 cal", "4,2 J", "1 J", "4,2 cal"]', 3, '4,2 Joule.', true),
('Science', 'medium', 'Nguyên tố Fe là gì?', '["Vàng", "Đồng", "Sắt", "Kẽm"]', 2, 'Sắt.', true),
('Science', 'medium', 'Hệ tuần hoàn của con người gồm?', '["Tim và mạch máu", "Tim và phổi", "Phổi và mạch máu", "Tim và gan"]', 0, 'Tim và mạch máu.', true),
('Science', 'medium', 'Mặt Trời có nhiệt độ bề mặt khoảng bao nhiêu?', '["5.500°C", "10.000°C", "1.000°C", "100.000°C"]', 0, '5.500°C.', true),
('Science', 'medium', 'Thành phần chính của không khí là gì?', '["Oxy", "Nitơ", "CO2", "H2O"]', 1, 'Nitơ chiếm đa số.', true),
('Science', 'medium', 'Hiện tượng nào sau đây là vật lý học?', '["Quang hợp", "Bay lên của chim", "Phản xạ ánh sáng", "Hô hấp"]', 2, 'Phản xạ ánh sáng.', true),
('Science', 'medium', 'Loài nào là sinh vật nhân chuẩn?', '["Vi khuẩn", "Nấm men", "Virus", "Vi rút"]', 1, 'Nấm men.', true),
('Science', 'medium', 'Tế bào nào tạo ra insulin?', '["Tế bào beta", "Tế bào alpha", "Tế bào delta", "Tế bào gamma"]', 0, 'Tế bào beta.', true),
('Science', 'medium', 'Khí nào gây hiệu ứng nhà kính nhiều nhất?', '["CO2", "O2", "N2", "H2"]', 0, 'CO2.', true),
('Science', 'medium', 'Đơn vị đo năng lượng là gì?', '["Cal", "Joule", "Newton", "Watt"]', 1, 'Joule.', true),
('Science', 'medium', 'Kính thiên văn được phát minh bởi ai?', '["Galileo", "Newton", "Einstein", "Tesla"]', 0, 'Galileo.', true),
('Science', 'medium', 'Quá trình phân hủy hữu cơ cần gì?', '["Nước", "Không khí", "Vi sinh vật", "Tất cả trên"]', 3, 'Tất cả đều đúng.', true),

-- Khó
('Science', 'hard', 'Định luật Vạn vật hấp dẫn là của ai?', '["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Stephen Hawking"]', 1, 'Isaac Newton.', true),
('Science', 'hard', 'ADN là viết tắt của từ gì?', '["Axit Deoxyribonucleic", "Axit Ribonucleic", "Axit Amin", "Axit Sunfuric"]', 0, 'Deoxyribonucleic Acid.', true),
('Science', 'hard', 'Hạt nhân nguyên tử được cấu tạo bởi?', '["Electron và Proton", "Proton và Neutron", "Chỉ Proton", "Electron và Neutron"]', 1, 'Proton và Neutron.', true),
('Science', 'hard', 'Nguyên tố hóa học phổ biến nhất trong vũ trụ?', '["Oxy", "Heli", "Hydro", "Carbon"]', 2, 'Hydro.', true),
('Science', 'hard', 'Thuyết Tương đối là của ai?', '["Isaac Newton", "Albert Einstein", "Marie Curie", "Niels Bohr"]', 1, 'Albert Einstein.', true),

-- 15 câu Hard bổ sung
('Science', 'hard', 'Phản ứng hóa học: H2 + O2 tạo thành gì?', '["H2O", "H2O2", "O2H", "OH"]', 0, 'H2O.', true),
('Science', 'hard', 'Nguyên tử gồm những hạt nào?', '["Electron, Proton, Neutron", "Electron, Proton", "Proton, Neutron", "Electron, Neutron"]', 0, 'Electron, Proton, Neutron.', true),
('Science', 'hard', 'Nguyên tố Cu là gì?', '["Đồng", "Chì", "Sắt", "Kẽm"]', 0, 'Đồng.', true),
('Science', 'hard', 'Hệ sinh thái rừng mưa nhiệt đới nằm chủ yếu ở đâu?', '["Châu Phi", "Châu Á", "Châu Mỹ Latinh", "Cả ba"]', 3, 'Cả ba.', true),
('Science', 'hard', 'Tia X được phát hiện bởi ai?', '["Wilhelm Röntgen", "Marie Curie", "Thomas Edison", "Albert Einstein"]', 0, 'Wilhelm Röntgen.', true),
('Science', 'hard', 'Đơn vị đo cường độ âm thanh là gì?', '["Decibel", "Watt", "Joule", "Ampere"]', 0, 'Decibel.', true),
('Science', 'hard', 'Chất nào làm tăng axit trong dạ dày?', '["HCl", "H2O", "NaOH", "CO2"]', 0, 'HCl.', true),
('Science', 'hard', 'Nước biển có độ mặn khoảng bao nhiêu %?', '["3.5%", "5%", "7%", "10%"]', 0, 'Khoảng 3.5%.', true),
('Science', 'hard', 'Hệ Mặt Trời gồm bao nhiêu hành tinh lùn?', '["1", "2", "5", "7"]', 2, '5 hành tinh lùn.', true),
('Science', 'hard', 'Định luật 3 Newton nói về gì?', '["Lực hấp dẫn", "Chuyển động", "Động lượng", "Tương tác lực"]', 3, 'Tương tác lực.', true),
('Science', 'hard', 'Đơn vị đo khối lượng trong SI là?', '["Gram", "Kilogram", "Ton", "Pound"]', 1, 'Kilogram.', true),
('Science', 'hard', 'Phản ứng hóa học Na + Cl2 tạo thành?', '["NaCl", "NaCl2", "Na2Cl", "ClNa"]', 0, 'NaCl.', true),
('Science', 'hard', 'Khí Nitơ N2 chiếm bao nhiêu % không khí?', '["78%", "21%", "1%", "50%"]', 0, '78%.', true),
('Science', 'hard', 'Tế bào hồng cầu chứa gì?', '["Huyết sắc tố", "Protein", "Nước", "Oxy"]', 0, 'Huyết sắc tố (Hemoglobin).', true),
('Science', 'hard', 'Chất nào làm thay đổi màu quỳ tím?', '["Axit và Bazơ", "Muối", "Nước", "Rượu"]', 0, 'Axit và Bazơ.', true);
-- =======================================================
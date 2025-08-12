/*
  # Seed Mock Data for Vena Pictures Application

  1. Insert sample data for all tables
  2. Maintain referential integrity
  3. Use realistic Indonesian business data
*/

-- Insert sample users
INSERT INTO users (id, email, full_name, role, permissions) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@venapictures.com', 'Admin Vena Pictures', 'Admin', '{}'),
('550e8400-e29b-41d4-a716-446655440001', 'editor@venapictures.com', 'Editor Vena', 'Member', '["Proyek", "Freelancer", "Manajemen Aset"]')
ON CONFLICT (id) DO NOTHING;

-- Insert sample profile
INSERT INTO profiles (
  id, user_id, full_name, email, phone, company_name, website, address, bank_account, 
  authorized_signer, bio, income_categories, expense_categories, project_types, 
  event_types, asset_categories, sop_categories, project_status_config, 
  notification_settings, security_settings, briefing_template
) VALUES (
  '550e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440000',
  'Vena Pictures',
  'hello@venapictures.com',
  '+62812-3456-7890',
  'Vena Pictures Studio',
  'https://venapictures.com',
  'Jl. Fotografi No. 123, Jakarta Selatan',
  'BCA 1234567890 a.n. Vena Pictures',
  'Vena Pictures',
  'Studio fotografi profesional yang mengkhususkan diri dalam dokumentasi pernikahan dan acara spesial.',
  '["DP Proyek", "Pelunasan Proyek", "Penjualan Produk", "Lain-lain"]',
  '["Gaji Freelancer", "Operasional", "Peralatan", "Transport", "Printing", "Marketing"]',
  '["Pernikahan", "Prewedding", "Engagement", "Birthday Party", "Corporate Event", "Graduation"]',
  '["Meeting Klien", "Survey Lokasi", "Libur", "Workshop", "Lainnya"]',
  '["Kamera", "Lensa", "Lighting", "Audio", "Komputer", "Aksesoris"]',
  '["Fotografi", "Videografi", "Editing", "Administrasi", "Marketing"]',
  '[
    {"id": "status_1", "name": "Dikonfirmasi", "color": "#3b82f6", "subStatuses": [], "note": "Proyek telah dikonfirmasi dan siap dikerjakan"},
    {"id": "status_2", "name": "Briefing", "color": "#8b5cf6", "subStatuses": [{"name": "Briefing Tim", "note": "Memberikan briefing kepada tim"}, {"name": "Persiapan Alat", "note": "Mempersiapkan peralatan"}], "note": "Tahap persiapan dan briefing"},
    {"id": "status_3", "name": "Eksekusi", "color": "#f97316", "subStatuses": [{"name": "Pemotretan", "note": "Proses pemotretan berlangsung"}, {"name": "Dokumentasi", "note": "Dokumentasi acara"}], "note": "Tahap pelaksanaan pemotretan"},
    {"id": "status_4", "name": "Editing", "color": "#06b6d4", "subStatuses": [{"name": "Seleksi Foto", "note": "Memilih foto terbaik"}, {"name": "Edit Foto", "note": "Proses editing foto"}, {"name": "Review Internal", "note": "Review hasil editing"}], "note": "Tahap post-production"},
    {"id": "status_5", "name": "Review Klien", "color": "#eab308", "subStatuses": [{"name": "Kirim Preview", "note": "Mengirim preview ke klien"}, {"name": "Feedback Klien", "note": "Menunggu feedback dari klien"}], "note": "Tahap review oleh klien"},
    {"id": "status_6", "name": "Printing", "color": "#6366f1", "subStatuses": [{"name": "Persiapan Print", "note": "Mempersiapkan file untuk print"}, {"name": "Proses Cetak", "note": "Proses pencetakan album"}], "note": "Tahap pencetakan produk fisik"},
    {"id": "status_7", "name": "Dikirim", "color": "#10b981", "subStatuses": [], "note": "Produk telah dikirim ke klien"},
    {"id": "status_8", "name": "Selesai", "color": "#10b981", "subStatuses": [], "note": "Proyek telah selesai sepenuhnya"},
    {"id": "status_9", "name": "Dibatalkan", "color": "#ef4444", "subStatuses": [], "note": "Proyek dibatalkan"}
  ]',
  '{"newProject": true, "paymentConfirmation": true, "deadlineReminder": true}',
  '{"twoFactorEnabled": false}',
  'Halo tim! Briefing untuk proyek [PROJECT_NAME] pada [DATE] di [LOCATION]. Mohon persiapkan peralatan dan datang tepat waktu. Terima kasih!'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample packages
INSERT INTO packages (id, name, price, physical_items, digital_items, processing_time, photographers, videographers) VALUES
('550e8400-e29b-41d4-a716-446655440020', 'Paket Silver', 5000000, '[{"name": "Album 20x30 (20 halaman)", "price": 500000}]', '["300+ foto edit", "File RAW", "Online gallery"]', '14 hari kerja', '2 Fotografer', '1 Videografer'),
('550e8400-e29b-41d4-a716-446655440021', 'Paket Gold', 8000000, '[{"name": "Album 25x35 (30 halaman)", "price": 800000}, {"name": "Mini album 15x20", "price": 300000}]', '["500+ foto edit", "File RAW", "Online gallery", "Highlight video 3-5 menit"]', '21 hari kerja', '3 Fotografer', '2 Videografer'),
('550e8400-e29b-41d4-a716-446655440022', 'Paket Platinum', 12000000, '[{"name": "Album premium 30x40 (40 halaman)", "price": 1200000}, {"name": "Mini album 15x20", "price": 300000}, {"name": "Flashdisk custom", "price": 150000}]', '["800+ foto edit", "File RAW", "Online gallery", "Cinematic video 8-10 menit", "Same day edit"]', '30 hari kerja', '4 Fotografer', '3 Videografer')
ON CONFLICT (id) DO NOTHING;

-- Insert sample add-ons
INSERT INTO add_ons (id, name, price) VALUES
('550e8400-e29b-41d4-a716-446655440030', 'Drone Photography', 1500000),
('550e8400-e29b-41d4-a716-446655440031', 'Extra Photographer', 800000),
('550e8400-e29b-41d4-a716-446655440032', 'Live Streaming', 2000000),
('550e8400-e29b-41d4-a716-446655440033', 'Photo Booth', 1200000)
ON CONFLICT (id) DO NOTHING;

-- Insert sample clients
INSERT INTO clients (id, name, email, phone, instagram, since, status, client_type, last_contact, portal_access_id) VALUES
('550e8400-e29b-41d4-a716-446655440040', 'Budi & Sari', 'budi.sari@email.com', '+62812-1111-1111', '@budisari_wedding', '2024-01-15', 'Aktif', 'Langsung', '2024-01-15T10:00:00Z', 'portal-budi-sari-123'),
('550e8400-e29b-41d4-a716-446655440041', 'Ahmad & Fatimah', 'ahmad.fatimah@email.com', '+62813-2222-2222', '@ahmadfatimah', '2024-02-01', 'Aktif', 'Langsung', '2024-02-01T14:30:00Z', 'portal-ahmad-fatimah-456'),
('550e8400-e29b-41d4-a716-446655440042', 'PT. Maju Bersama', 'info@majubersama.com', '+62821-3333-3333', '@majubersama_corp', '2024-01-20', 'Aktif', 'Vendor', '2024-01-20T09:15:00Z', 'portal-majubersama-789')
ON CONFLICT (id) DO NOTHING;

-- Insert sample team members
INSERT INTO team_members (id, name, role, email, phone, standard_fee, no_rek, reward_balance, rating, performance_notes, portal_access_id) VALUES
('550e8400-e29b-41d4-a716-446655440050', 'Andi Photographer', 'Fotografer', 'andi@email.com', '+62814-1111-1111', 800000, 'BCA 9876543210', 500000, 4.8, '[]', 'freelancer-andi-123'),
('550e8400-e29b-41d4-a716-446655440051', 'Sinta Editor', 'Editor', 'sinta@email.com', '+62815-2222-2222', 600000, 'Mandiri 1122334455', 300000, 4.9, '[]', 'freelancer-sinta-456'),
('550e8400-e29b-41d4-a716-446655440052', 'Rudi Videographer', 'Videografer', 'rudi@email.com', '+62816-3333-3333', 900000, 'BNI 5566778899', 750000, 4.7, '[]', 'freelancer-rudi-789')
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (
  id, project_name, client_name, client_id, project_type, package_name, package_id,
  add_ons, date, location, progress, status, total_cost, amount_paid, payment_status,
  team, notes
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440060',
  'Wedding Budi & Sari',
  'Budi & Sari',
  '550e8400-e29b-41d4-a716-446655440040',
  'Pernikahan',
  'Paket Gold',
  '550e8400-e29b-41d4-a716-446655440021',
  '[{"id": "550e8400-e29b-41d4-a716-446655440030", "name": "Drone Photography", "price": 1500000}]',
  '2024-03-15',
  'Gedung Serbaguna Jakarta',
  75,
  'Editing',
  9500000,
  4750000,
  'DP Terbayar',
  '[{"memberId": "550e8400-e29b-41d4-a716-446655440050", "name": "Andi Photographer", "role": "Fotografer", "fee": 800000, "reward": 100000}]',
  'Pernikahan outdoor dengan tema garden party'
),
(
  '550e8400-e29b-41d4-a716-446655440061',
  'Prewedding Ahmad & Fatimah',
  'Ahmad & Fatimah',
  '550e8400-e29b-41d4-a716-446655440041',
  'Prewedding',
  'Paket Silver',
  '550e8400-e29b-41d4-a716-446655440020',
  '[]',
  '2024-02-28',
  'Taman Mini Indonesia Indah',
  100,
  'Selesai',
  5000000,
  5000000,
  'Lunas',
  '[{"memberId": "550e8400-e29b-41d4-a716-446655440050", "name": "Andi Photographer", "role": "Fotografer", "fee": 800000, "reward": 50000}]',
  'Sesi prewedding dengan konsep tradisional'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample cards
INSERT INTO cards (id, card_holder_name, bank_name, card_type, last_four_digits, balance, color_gradient) VALUES
('550e8400-e29b-41d4-a716-446655440070', 'Vena Pictures', 'BCA', 'Debit', '1234', 25000000, 'from-blue-500 to-sky-400'),
('550e8400-e29b-41d4-a716-446655440071', 'Vena Pictures', 'Mandiri', 'Debit', '5678', 15000000, 'from-red-500 to-orange-400'),
('550e8400-e29b-41d4-a716-446655440072', 'Vena Pictures', 'Tunai', 'Prabayar', 'CASH', 5000000, 'from-green-500 to-emerald-400')
ON CONFLICT (id) DO NOTHING;

-- Insert sample financial pockets
INSERT INTO financial_pockets (id, name, description, icon, type, amount, goal_amount) VALUES
('550e8400-e29b-41d4-a716-446655440080', 'Dana Darurat', 'Dana untuk keperluan mendesak', 'piggy-bank', 'Nabung & Bayar', 10000000, 20000000),
('550e8400-e29b-41d4-a716-446655440081', 'Upgrade Peralatan', 'Tabungan untuk membeli peralatan baru', 'lock', 'Terkunci', 5000000, 15000000),
('550e8400-e29b-41d4-a716-446655440082', 'Reward Pool', 'Pool hadiah untuk freelancer', 'star', 'Tabungan Hadiah Freelancer', 2000000, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (id, date, description, amount, type, project_id, category, method, card_id) VALUES
('550e8400-e29b-41d4-a716-446655440090', '2024-01-15', 'DP Wedding Budi & Sari', 4750000, 'Pemasukan', '550e8400-e29b-41d4-a716-446655440060', 'DP Proyek', 'Transfer Bank', '550e8400-e29b-41d4-a716-446655440070'),
('550e8400-e29b-41d4-a716-446655440091', '2024-01-20', 'Pembelian Lensa Baru', 8000000, 'Pengeluaran', NULL, 'Peralatan', 'Transfer Bank', '550e8400-e29b-41d4-a716-446655440070'),
('550e8400-e29b-41d4-a716-446655440092', '2024-02-28', 'Pelunasan Prewedding Ahmad & Fatimah', 2500000, 'Pemasukan', '550e8400-e29b-41d4-a716-446655440061', 'Pelunasan Proyek', 'Transfer Bank', '550e8400-e29b-41d4-a716-446655440070')
ON CONFLICT (id) DO NOTHING;

-- Insert sample leads
INSERT INTO leads (id, name, contact_channel, location, status, date, notes) VALUES
('550e8400-e29b-41d4-a716-446655440100', 'Dina & Reza', 'Instagram', 'Bandung', 'Sedang Diskusi', '2024-01-25', 'Tertarik paket Gold untuk pernikahan di Bandung'),
('550e8400-e29b-41d4-a716-446655440101', 'Maya Sari', 'WhatsApp', 'Surabaya', 'Menunggu Follow Up', '2024-01-28', 'Ingin prewedding dengan tema vintage'),
('550e8400-e29b-41d4-a716-446655440102', 'PT. Teknologi Maju', 'Website', 'Jakarta', 'Dikonversi', '2024-01-30', 'Corporate event tahunan')
ON CONFLICT (id) DO NOTHING;

-- Insert sample team project payments
INSERT INTO team_project_payments (id, project_id, team_member_name, team_member_id, date, status, fee, reward) VALUES
('550e8400-e29b-41d4-a716-446655440110', '550e8400-e29b-41d4-a716-446655440060', 'Andi Photographer', '550e8400-e29b-41d4-a716-446655440050', '2024-03-15', 'Unpaid', 800000, 100000),
('550e8400-e29b-41d4-a716-446655440111', '550e8400-e29b-41d4-a716-446655440061', 'Andi Photographer', '550e8400-e29b-41d4-a716-446655440050', '2024-02-28', 'Paid', 800000, 50000)
ON CONFLICT (id) DO NOTHING;

-- Insert sample assets
INSERT INTO assets (id, name, category, purchase_date, purchase_price, status, notes) VALUES
('550e8400-e29b-41d4-a716-446655440120', 'Canon EOS R5', 'Kamera', '2023-06-15', 65000000, 'Tersedia', 'Kamera utama untuk wedding'),
('550e8400-e29b-41d4-a716-446655440121', 'Sony FX3', 'Kamera', '2023-08-20', 45000000, 'Digunakan', 'Kamera video profesional'),
('550e8400-e29b-41d4-a716-446655440122', 'Godox AD600Pro', 'Lighting', '2023-05-10', 8000000, 'Tersedia', 'Flash studio portable')
ON CONFLICT (id) DO NOTHING;

-- Insert sample client feedback
INSERT INTO client_feedback (id, client_name, satisfaction, rating, feedback, date) VALUES
('550e8400-e29b-41d4-a716-446655440130', 'Ahmad & Fatimah', 'Sangat Puas', 5, 'Hasil foto prewedding sangat memuaskan! Tim sangat profesional dan ramah. Terima kasih Vena Pictures!', '2024-03-05'),
('550e8400-e29b-41d4-a716-446655440131', 'Keluarga Wijaya', 'Puas', 4, 'Pelayanan baik, hasil foto bagus. Mungkin bisa lebih cepat dalam pengiriman hasil.', '2024-02-20')
ON CONFLICT (id) DO NOTHING;

-- Insert sample contracts
INSERT INTO contracts (
  id, contract_number, client_id, project_id, signing_date, signing_location,
  client_name1, client_address1, client_phone1, shooting_duration, guaranteed_photos,
  album_details, digital_files_format, other_items, personnel_count, delivery_timeframe,
  dp_date, final_payment_date, cancellation_policy, jurisdiction
) VALUES (
  '550e8400-e29b-41d4-a716-446655440140',
  'VP/CTR/2024/001',
  '550e8400-e29b-41d4-a716-446655440040',
  '550e8400-e29b-41d4-a716-446655440060',
  '2024-01-15',
  'Jakarta',
  'Budi Santoso',
  'Jl. Mawar No. 45, Jakarta Selatan',
  '+62812-1111-1111',
  '8 jam (10:00 - 18:00)',
  '500+ foto edit berkualitas tinggi',
  'Album premium 25x35 (30 halaman)',
  'JPG High-Resolution + RAW Files',
  'Highlight video 3-5 menit',
  '3 Fotografer, 2 Videografer',
  '21 hari kerja',
  '2024-01-15',
  '2024-03-12',
  'DP yang sudah dibayarkan tidak dapat dikembalikan. Jika pembatalan dilakukan H-7 sebelum hari pelaksanaan, PIHAK KEDUA wajib membayar 50% dari total biaya.',
  'Jakarta Selatan'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (id, title, message, timestamp, is_read, icon, link_view, link_action) VALUES
('550e8400-e29b-41d4-a716-446655440150', 'Proyek Baru', 'Proyek Wedding Budi & Sari telah dibuat', '2024-01-15T10:00:00Z', false, 'lead', 'Proyek', '{"type": "VIEW_PROJECT_DETAILS", "id": "550e8400-e29b-41d4-a716-446655440060"}'),
('550e8400-e29b-41d4-a716-446655440151', 'Pembayaran Diterima', 'DP sebesar Rp 4.750.000 telah diterima dari Budi & Sari', '2024-01-15T11:30:00Z', false, 'payment', 'Keuangan', '{}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample promo codes
INSERT INTO promo_codes (id, code, discount_type, discount_value, is_active, usage_count, max_usage, expiry_date) VALUES
('550e8400-e29b-41d4-a716-446655440160', 'NEWCLIENT2024', 'percentage', 10, true, 2, 50, '2024-12-31'),
('550e8400-e29b-41d4-a716-446655440161', 'EARLYBIRD', 'fixed', 500000, true, 5, 20, '2024-06-30')
ON CONFLICT (id) DO NOTHING;

-- Insert sample SOPs
INSERT INTO sops (id, title, category, content, last_updated) VALUES
('550e8400-e29b-41d4-a716-446655440170', 'Prosedur Pemotretan Wedding', 'Fotografi', 'Langkah-langkah standar untuk pemotretan pernikahan:\n\n1. Persiapan Alat\n- Cek baterai kamera\n- Siapkan memory card cadangan\n- Test flash dan lighting\n\n2. Koordinasi Tim\n- Briefing dengan tim\n- Pembagian tugas\n- Koordinasi dengan WO\n\n3. Eksekusi\n- Dokumentasi persiapan\n- Ceremony coverage\n- Reception documentation', '2024-01-01'),
('550e8400-e29b-41d4-a716-446655440171', 'Workflow Editing Foto', 'Editing', 'Proses editing foto standar:\n\n1. Import & Backup\n- Import semua foto ke Lightroom\n- Backup ke cloud storage\n\n2. Seleksi\n- Pilih foto terbaik\n- Hapus foto blur/duplicate\n\n3. Basic Editing\n- Color correction\n- Exposure adjustment\n- Crop jika diperlukan\n\n4. Advanced Editing\n- Skin retouching\n- Background cleanup\n- Creative effects\n\n5. Export\n- Export high-res untuk client\n- Watermark untuk preview', '2024-01-01')
ON CONFLICT (id) DO NOTHING;

-- Insert sample social media posts
INSERT INTO social_media_posts (id, project_id, client_name, post_type, platform, scheduled_date, caption, status) VALUES
('550e8400-e29b-41d4-a716-446655440180', '550e8400-e29b-41d4-a716-446655440061', 'Ahmad & Fatimah', 'Instagram Feed', 'Instagram', '2024-03-10', 'Beautiful prewedding session with Ahmad & Fatimah 💕 #VenaPictures #PreweddingJakarta #LoveStory', 'Terjadwal'),
('550e8400-e29b-41d4-a716-446655440181', '550e8400-e29b-41d4-a716-446655440060', 'Budi & Sari', 'Instagram Reels', 'Instagram', '2024-03-20', 'Behind the scenes dari wedding Budi & Sari! 🎬✨ #BehindTheScenes #WeddingDay #VenaPictures', 'Draf')
ON CONFLICT (id) DO NOTHING;
-- khusus test: $1 potongan teks query; jumlah sesi yang sedang menunggu kunci baris saat menjalankan query itu
SELECT COUNT(*)::int AS count
FROM pg_stat_activity
WHERE datname = current_database() AND wait_event_type = 'Lock' AND position($1 in query) > 0;

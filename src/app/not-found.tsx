import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-heading-1 text-text-primary mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-body-large text-text-secondary mb-6 max-w-md">
          Halaman yang Anda cari tidak dapat ditemukan. Mungkin telah dipindahkan atau dihapus.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-button text-label transition-all duration-200 hover:bg-primary-hover"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
} 
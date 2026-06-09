import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      background: '#050A0E',
    }}>
      <Header />
      <main style={{ flex: 1, height: 'auto' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
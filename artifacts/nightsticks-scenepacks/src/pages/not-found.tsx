import { Link } from 'wouter';
import { ArrowLeft, ScanSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="not-found" data-testid="status-not-found">
      <div>
        <ScanSearch size={30} color="#a78bfa" strokeWidth={1.4} aria-hidden="true" />
        <div className="section-kicker" style={{ justifyContent: 'center', marginTop: 17 }}>Frame not found / 404</div>
        <h1>Nothing in this reel.</h1>
        <p>This sample archive doesn’t have a page at that address.</p>
        <Link href="/" data-testid="link-not-found-home"><ArrowLeft size={14} style={{ marginRight: 8 }} /> Return to the archive</Link>
      </div>
    </main>
  );
}

import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">X</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Auto<span className="text-primary">X402</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Next-generation car maintenance powered by blockchain payments on Avalanche.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services" className="hover:text-primary transition-colors">Car Service</Link></li>
              <li><Link to="/wash" className="hover:text-primary transition-colors">Car Wash</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Find Location</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Blockchain */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Blockchain</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://www.avax.network/" target="_blank" rel="noopener" className="hover:text-primary transition-colors">Avalanche</a></li>
              <li><a href="https://build.avax.network/academy/blockchain/x402-payment-infrastructure" target="_blank" rel="noopener" className="hover:text-primary transition-colors">x402 Protocol</a></li>
              <li><a href="https://core.app/" target="_blank" rel="noopener" className="hover:text-primary transition-colors">Core Wallet</a></li>
              <li><a href="https://thirdweb.com/" target="_blank" rel="noopener" className="hover:text-primary transition-colors">thirdweb</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Established in 2025. Own your car. Love your car &lt;3
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

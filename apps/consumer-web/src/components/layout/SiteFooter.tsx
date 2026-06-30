/* Planviry Footer — implemented exactly as specified, with routes wired */

import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="bg-white text-gray-900 py-16 px-6 md:px-12 lg:px-24 border-t border-gray-200">
      <div className="w-full">
        {/* BEGIN: TopSection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Brand and About Column */}
          <div className="lg:col-span-4">
            <div className="">
              <img
                alt="Planvry Logo"
                className="w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1oWMnFkueSntqkdOWcMcIBUvhpGpLPuKIHLlrD4niSEr9Riuq35F6t1ezRduuZGevQxi7e1PdRBdpWo0GNplWs4aK_3_m7zXLwfj9_mkFGqunzdIyAY13riYqwgxQt1mwrbyeg9pU-pq1wxq5f6SBlubBFlJoURVwjngQjMA1TfkmUWYZEXcIOTgwEVr7WpUgfLzYxI6la7uIjColDm4S8Lb7iSOt3XUvU8i3tUhTgQzV61jRHqGuXct6CjaM9nuTplzU9wxbW4QC"
                style={{ height: '140px', marginTop: '-35px' }}
              />
            </div>
            <p
              className="text-[15px] leading-relaxed text-gray-600 mb-8 max-w-md"
              style={{ marginTop: '-40px' }}
            >
              The marketplace for booking extraordinary events and discovering local, vetted vendors. From intimate
              micro-weddings to large corporate retreats, Planviry brings your vision to life.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              <a className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors" href="#">
                <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg"><rect height="20" rx="5" ry="5" width="20" x="2" y="2"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
              <a className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors" href="#">
                <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
              </a>
              <a className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors" href="#">
                <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </a>
            </div>
          </div>
          {/* Navigation Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Surfaces */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-6">Surfaces</h3>
              <ul className="space-y-3 text-[14px] text-gray-600">
                <li><Link className="hover:text-pink-500" href="/services">Concierge</Link></li>
                <li><Link className="hover:text-pink-500" href="/plan">Plan</Link></li>
                <li><Link className="hover:text-pink-500" href="/things-to-do">Things to Do</Link></li>
                <li><Link className="hover:text-pink-500" href="/food-drink">Food &amp; Drink</Link></li>
                <li><Link className="hover:text-pink-500" href="/live-shows">Live Shows</Link></li>
                <li><Link className="hover:text-pink-500" href="/travel">Travel</Link></li>
                <li><Link className="hover:text-pink-500" href="/party">Party</Link></li>
                <li><Link className="hover:text-pink-500" href="/spaces">Spaces</Link></li>
                <li><Link className="hover:text-pink-500" href="/vendors">Vendors</Link></li>
              </ul>
            </div>
            {/* Platform */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-6">Platform</h3>
              <ul className="space-y-3 text-[14px] text-gray-600">
                <li><Link className="hover:text-pink-500" href="/vendors">Marketplace</Link></li>
                <li><Link className="hover:text-pink-500" href="/plan">Plan Your Event</Link></li>
                <li><Link className="hover:text-pink-500" href="/itinerary">Itinerary</Link></li>
                <li><Link className="hover:text-pink-500" href="/checkout">Unified Cart</Link></li>
                <li><Link className="hover:text-pink-500" href="/vendors">Search Vendors</Link></li>
                <li><Link className="hover:text-pink-500" href="/explore?tab=categories">How it Works</Link></li>
              </ul>
            </div>
            {/* For Vendors */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-6">For Vendors</h3>
              <ul className="space-y-3 text-[14px] text-gray-600">
                <li><Link className="hover:text-pink-500" href="/vendor-portal">Vendor Portal</Link></li>
                <li><Link className="hover:text-pink-500" href="/vendor-portal">List Your Business</Link></li>
                <li><Link className="hover:text-pink-500" href="/vendor-portal">Vendor Dashboard</Link></li>
                <li><Link className="hover:text-pink-500" href="/vendor-portal">Marketing Tools</Link></li>
                <li><Link className="hover:text-pink-500" href="/legal">Safety &amp; Security</Link></li>
              </ul>
            </div>
            {/* Company */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-6">Company</h3>
              <ul className="space-y-3 text-[14px] text-gray-600">
                <li><Link className="hover:text-pink-500" href="/about">About Us</Link></li>
                <li><Link className="hover:text-pink-500" href="/about">Our Vision</Link></li>
                <li><Link className="hover:text-pink-500" href="/about">Careers</Link></li>
                <li><Link className="hover:text-pink-500" href="/about">Press Office</Link></li>
                <li><Link className="hover:text-pink-500" href="/legal">Privacy Policy</Link></li>
                <li><Link className="hover:text-pink-500" href="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
        {/* END: TopSection */}
        {/* BEGIN: DirectorySection */}
        <div className="border-t border-gray-100 pt-12 pb-16 space-y-12">
          {/* Popular Cities */}
          <section>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 mb-6">Popular Cities</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-gray-600">
              <Link className="hover:underline" href="/explore/city/new-york">New York</Link>
              <Link className="hover:underline" href="/explore/city/los-angeles">Los Angeles</Link>
              <Link className="hover:underline" href="/explore/city/chicago">Chicago</Link>
              <Link className="hover:underline" href="/explore/city/miami">Miami</Link>
              <Link className="hover:underline" href="/explore/city/nashville">Nashville</Link>
              <Link className="hover:underline" href="/explore/city/atlanta">Atlanta</Link>
              <Link className="hover:underline" href="/explore/city/denver">Denver</Link>
              <Link className="hover:underline" href="/explore/city/dallas">Dallas</Link>
              <Link className="hover:underline" href="/explore/city/san-francisco">San Francisco</Link>
              <Link className="hover:underline" href="/explore/city/phoenix">Phoenix</Link>
              <Link className="hover:underline" href="/explore/city/seattle">Seattle</Link>
              <Link className="hover:underline" href="/explore/city/boston">Boston</Link>
              <Link className="hover:underline" href="/explore/city/las-vegas">Las Vegas</Link>
              <Link className="hover:underline" href="/explore/city/houston">Houston</Link>
              <Link className="hover:underline" href="/explore/city/orlando">Orlando</Link>
              <Link className="hover:underline" href="/explore/city/detroit">Detroit</Link>
              <Link className="hover:underline" href="/explore/city/minneapolis">Minneapolis</Link>
              <Link className="hover:underline" href="/explore/city/philadelphia">Philadelphia</Link>
              <Link className="hover:underline" href="/explore/city/charlotte">Charlotte</Link>
              <Link className="hover:underline" href="/explore/city/milwaukee">Milwaukee</Link>
              <Link className="hover:underline" href="/explore/city/austin">Austin</Link>
              <Link className="hover:underline" href="/explore/city/san-diego">San Diego</Link>
              <Link className="hover:underline" href="/explore/city/san-jose">San Jose</Link>
              <Link className="hover:underline" href="/explore/city/jacksonville">Jacksonville</Link>
              <Link className="hover:underline" href="/explore/city/fort-worth">Fort Worth</Link>
              <Link className="hover:underline" href="/explore/city/columbus">Columbus</Link>
              <Link className="hover:underline" href="/explore/city/indianapolis">Indianapolis</Link>
              <Link className="hover:underline" href="/explore/city/washington">Washington</Link>
              <Link className="hover:underline" href="/explore/city/el-paso">El Paso</Link>
              <Link className="hover:underline" href="/explore/city/oklahoma-city">Oklahoma City</Link>
              <Link className="hover:underline" href="/explore/city/portland">Portland</Link>
              <Link className="hover:underline" href="/explore/city/memphis">Memphis</Link>
              <Link className="hover:underline" href="/explore/city/louisville">Louisville</Link>
              <Link className="hover:underline" href="/explore/city/baltimore">Baltimore</Link>
              <Link className="hover:underline" href="/explore/city/tucson">Tucson</Link>
              <Link className="hover:underline" href="/explore/city/albuquerque">Albuquerque</Link>
              <Link className="hover:underline" href="/explore/city/fresno">Fresno</Link>
              <Link className="hover:underline" href="/explore/city/sacramento">Sacramento</Link>
              <Link className="hover:underline" href="/explore/city/kansas-city">Kansas City</Link>
              <Link className="hover:underline" href="/explore/city/mesa">Mesa</Link>
              <Link className="hover:underline" href="/explore/city/virginia-beach">Virginia Beach</Link>
              <Link className="hover:underline" href="/explore/city/omaha">Omaha</Link>
              <Link className="hover:underline" href="/explore/city/colorado-springs">Colorado Springs</Link>
              <Link className="hover:underline" href="/explore/city/raleigh">Raleigh</Link>
              <Link className="hover:underline" href="/explore/city/long-beach">Long Beach</Link>
            </div>
          </section>
          {/* Find Vendors by State */}
          <section>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 mb-6">Find Vendors by State</h3>
            <div className="grid grid-cols-4 md:grid-cols-10 gap-y-3 text-[14px] text-gray-600 max-w-4xl">
              <Link className="hover:underline" href="/explore/state/al">AL</Link>
              <Link className="hover:underline" href="/explore/state/ak">AK</Link>
              <Link className="hover:underline" href="/explore/state/az">AZ</Link>
              <Link className="hover:underline" href="/explore/state/ar">AR</Link>
              <Link className="hover:underline" href="/explore/state/ca">CA</Link>
              <Link className="hover:underline" href="/explore/state/co">CO</Link>
              <Link className="hover:underline" href="/explore/state/ct">CT</Link>
              <Link className="hover:underline" href="/explore/state/de">DE</Link>
              <Link className="hover:underline" href="/explore/state/dc">DC</Link>
              <Link className="hover:underline" href="/explore/state/fl">FL</Link>
              <Link className="hover:underline" href="/explore/state/ga">GA</Link>
              <Link className="hover:underline" href="/explore/state/hi">HI</Link>
              <Link className="hover:underline" href="/explore/state/id">ID</Link>
              <Link className="hover:underline" href="/explore/state/il">IL</Link>
              <Link className="hover:underline" href="/explore/state/in">IN</Link>
              <Link className="hover:underline" href="/explore/state/ia">IA</Link>
              <Link className="hover:underline" href="/explore/state/ks">KS</Link>
              <Link className="hover:underline" href="/explore/state/ky">KY</Link>
              <Link className="hover:underline" href="/explore/state/la">LA</Link>
              <Link className="hover:underline" href="/explore/state/me">ME</Link>
              <Link className="hover:underline" href="/explore/state/md">MD</Link>
              <Link className="hover:underline" href="/explore/state/ma">MA</Link>
              <Link className="hover:underline" href="/explore/state/mi">MI</Link>
              <Link className="hover:underline" href="/explore/state/mn">MN</Link>
              <Link className="hover:underline" href="/explore/state/ms">MS</Link>
              <Link className="hover:underline" href="/explore/state/mo">MO</Link>
              <Link className="hover:underline" href="/explore/state/mt">MT</Link>
              <Link className="hover:underline" href="/explore/state/ne">NE</Link>
              <Link className="hover:underline" href="/explore/state/nv">NV</Link>
              <Link className="hover:underline" href="/explore/state/nh">NH</Link>
              <Link className="hover:underline" href="/explore/state/nj">NJ</Link>
              <Link className="hover:underline" href="/explore/state/nm">NM</Link>
              <Link className="hover:underline" href="/explore/state/ny">NY</Link>
              <Link className="hover:underline" href="/explore/state/nc">NC</Link>
              <Link className="hover:underline" href="/explore/state/nd">ND</Link>
              <Link className="hover:underline" href="/explore/state/oh">OH</Link>
              <Link className="hover:underline" href="/explore/state/ok">OK</Link>
              <Link className="hover:underline" href="/explore/state/or">OR</Link>
              <Link className="hover:underline" href="/explore/state/pa">PA</Link>
              <Link className="hover:underline" href="/explore/state/ri">RI</Link>
            </div>
          </section>
        </div>
        {/* END: DirectorySection */}
        {/* BEGIN: UtilityRail */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-[13px] text-gray-700 font-semibold">
              © 2026 Planvry. Celebrating moments, locally. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-[13px] text-gray-700 font-semibold">
              <Link className="hover:text-pink-500 transition-colors" href="/legal">Legal Center</Link>
              <Link className="hover:text-pink-500 transition-colors" href="/legal">Platform Status</Link>
              <Link className="hover:text-pink-500 transition-colors" href="/legal">Security</Link>
              <Link className="hover:text-pink-500 transition-colors" href="/legal">Terms of Service</Link>
            </div>
          </div>
        </div>
        {/* END: UtilityRail */}
      </div>
    </footer>
  )
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Compass, Sparkles } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 bg-[#FAF9F6]">
      <div className="w-16 h-16 rounded-3xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-[#C6A15B]" />
      </div>
      <h1 className="text-5xl font-black text-[#202124] tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-bold text-[#343538] mb-2">Page Not Found</h2>
      <p className="text-xs text-[#666666] max-w-sm mb-6">
        The destination you are navigating to does not exist or has been shifted.
      </p>
      <Link to="/jobs">
        <Button variant="primary" icon={Compass}>
          Return to Verified Job Board
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;

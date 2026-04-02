import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { servicesData } from '@/lib/data/services';

export const useServiceColor = () => {
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const pathname = usePathname();

  useEffect(() => {
    // Only change color on individual service pages
    if (pathname.startsWith('/services/')) {
      const serviceId = pathname.split('/').pop();
      if (serviceId && servicesData[serviceId]) {
        setCurrentColor(servicesData[serviceId].accentColor);
      }
    } else {
      // Default to white for other pages
      setCurrentColor('#ffffff');
    }
  }, [pathname]);

  return currentColor;
};

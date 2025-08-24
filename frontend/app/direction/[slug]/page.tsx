'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo, useRef } from 'react';
import InspiraNavbar from '../../components/button';
import Image from 'next/image';

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

export default function DirectionPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busStops, setBusStops] = useState<any[]>([]);
  const [exhibitionLatLng, setExhibitionLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [allStops, setAllStops] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, stopsRes, allStopsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE}/exhibitions/${slug}`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE}/exhibitions/${slug}/nearby-bus`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bus-routes/all-stops`)
        ]);
        
        if (!eventRes.ok || !stopsRes.ok || !allStopsRes.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const eventData = await eventRes.json();
        const busData = await stopsRes.json();
        const allStopsData = await allStopsRes.json();
        
        setEvent(eventData);
        setBusStops(busData);
        setAllStops(allStopsData);
        
        if (eventData.latitude && eventData.longitude) {
          setExhibitionLatLng({ 
            lat: parseFloat(eventData.latitude), 
            lng: parseFloat(eventData.longitude) 
          });
        }
        
        setDataLoaded(true);
      } catch (err) {
        console.error('❌ Fetch error:', err);
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (typeof window !== 'undefined' && exhibitionLatLng && dataLoaded) {
      const initializeMap = () => {
        const map = new window.google.maps.Map(document.getElementById("map") as HTMLElement, {
          center: exhibitionLatLng,
          zoom: 15,
        });

        // Exhibition marker
        new window.google.maps.Marker({
          position: exhibitionLatLng,
          map,
          icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          title: '📍 Exhibition Location',
        });

        // Bus stop markers
        console.log('🗺️ busStops for map:', busStops);
        busStops.forEach((stop, index) => {
          console.log(`🚌 Stop ${index}:`, stop);
          
          // Find coordinates from allStops by matching stop_name
          const matchedStop = allStops.find(allStop => allStop.stop_name === stop.stop_name);
          console.log(`📍 Matched coordinates for "${stop.stop_name}":`, matchedStop);
          
          if (matchedStop && matchedStop.lat && matchedStop.lon) {
            const marker = new window.google.maps.Marker({
              position: { lat: parseFloat(matchedStop.lat), lng: parseFloat(matchedStop.lon) },
              map,
              icon: 'https://maps.google.com/mapfiles/ms/icons/bus.png',
              title: stop.stop_name,
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `<strong>${stop.stop_name}</strong><br>Distance: ${stop.distance} m`
            });

            marker.addListener("click", () => infoWindow.open(map, marker));
          } else {
            console.warn(`⚠️ No coordinates found for stop: ${stop.stop_name}`);
          }
        });
      };

      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        // Only load script if it doesn't exist
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY_HERE&callback=initMap&libraries=places`;
          script.async = true;
          script.defer = true;
          
          window.initMap = initializeMap;
          document.head.appendChild(script);
        } else {
          // Script exists, wait for it to load
          const checkGoogleMaps = setInterval(() => {
            if (window.google && window.google.maps) {
              clearInterval(checkGoogleMaps);
              initializeMap();
            }
          }, 100);
        }
      }
    }
  }, [exhibitionLatLng, dataLoaded]);

  const getTransportIcon = (name: string) => {
    const thaiNameOnly = name.split(/;|,/)[0].trim();
    if (/BTS|MRT|ARL|SRT|BRT/.test(thaiNameOnly)) return '🚆';
    if (/ท่าเรือ/.test(thaiNameOnly)) return '⛴️';
    return '🚌';
  };

  const useMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const input = document.getElementById('startStopInput') as HTMLInputElement;
          input.value = `@${latitude},${longitude}`;
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('ไม่สามารถเข้าถึงพิกัดของคุณได้');
        }
      );
    } else {
      alert('เบราว์เซอร์ของคุณไม่รองรับ Geolocation');
    }
  };

  const parseGoogleDirectionsResponse = (data: any) => {
    const resultContainer = document.getElementById('routes-display')!;
    
    if (data.status !== 'OK' || !data.routes || data.routes.length === 0) {
      resultContainer.innerHTML = `<p style="color:red;">ไม่พบเส้นทาง: ${data.error_message || 'ไม่สามารถหาเส้นทางได้'}</p>`;
      return;
    }

    let html = '<div class="space-y-4">';
    
    data.routes.forEach((route: any, routeIndex: number) => {
      html += `<div class="border rounded-lg p-4 bg-gray-50">`;
      html += `<h4 class="font-bold text-lg mb-2">เส้นทางที่ ${routeIndex + 1}</h4>`;
      
      if (route.fare) {
        html += `<div class="text-green-600 font-semibold mb-2">💰 ค่าโดยสาร: ${route.fare.text}</div>`;
      }
      
      route.legs.forEach((leg: any) => {
        html += `<div class="mb-3 border-l-4 border-blue-500 pl-4">`;
        html += `<div class="flex justify-between items-center mb-2">`;
        html += `<span class="font-semibold">📍 ${leg.start_address}</span>`;
        html += `<span class="text-sm text-gray-600">${leg.departure_time?.text || ''}</span>`;
        html += `</div>`;
        html += `<div class="text-sm text-gray-700 mb-2">⏱️ ${leg.duration.text} (${leg.distance.text})</div>`;
        
        leg.steps.forEach((step: any) => {
          if (step.travel_mode === 'TRANSIT') {
            const transit = step.transit_details;
            html += `<div class="ml-4 mb-2 p-2 bg-white rounded border">`;
            html += `<div class="flex items-center gap-2">`;
            
            const vehicleIcon = transit.line.vehicle.type === 'SUBWAY' ? '🚆' : 
                               transit.line.vehicle.type === 'BUS' ? '🚌' : '🚐';
            
            html += `<span class="text-xl">${vehicleIcon}</span>`;
            html += `<div>`;
            html += `<div class="font-semibold text-blue-600">${transit.line.short_name || ''} ${transit.line.name}</div>`;
            html += `<div class="text-sm text-gray-600">${transit.departure_stop.name} → ${transit.arrival_stop.name}</div>`;
            html += `<div class="text-xs text-gray-500">${transit.num_stops} ป้าย • ${step.duration.text}</div>`;
            html += `</div></div></div>`;
          } else if (step.travel_mode === 'WALKING') {
            html += `<div class="ml-4 mb-1 text-sm text-gray-600">🚶 เดิน ${step.distance.text} (${step.duration.text})</div>`;
          }
        });
        
        html += `<div class="font-semibold text-green-600">🎯 ${leg.end_address}</div>`;
        html += `</div>`;
      });
      
      html += `</div>`;
    });
    
    html += '</div>';
    resultContainer.innerHTML = html;
  };

  const suggestRoutes = async () => {
    const input = document.getElementById('startStopInput') as HTMLInputElement;
    const resultContainer = document.getElementById('routes-display')!;
    
    if (!exhibitionLatLng) {
      alert('ยังไม่พบพิกัดนิทรรศการ');
      return;
    }

    const val = input.value.trim();
    if (!val) {
      resultContainer.innerHTML = `<p style="color:red;">กรุณาระบุจุดเริ่มต้น</p>`;
      return;
    }

    resultContainer.innerHTML = `<p class="text-blue-600">🔍 กำลังค้นหาเส้นทาง...</p>`;

    try {
      if (val.startsWith('@')) {
        // ใช้พิกัดปัจจุบัน
        const parts = val.slice(1).split(',');
        const [lat, lng] = parts.map(parseFloat);
        
        if (isNaN(lat) || isNaN(lng)) {
          resultContainer.innerHTML = `<p style="color:red;">พิกัดไม่ถูกต้อง</p>`;
          return;
        }
        
        // ✅ ใช้ Google Directions API ผ่าน Backend
        const url = `${process.env.NEXT_PUBLIC_API_BASE}/bus-routes/suggest-route?lat=${lat}&lng=${lng}&exLat=${exhibitionLatLng.lat}&exLng=${exhibitionLatLng.lng}`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (!res.ok) {
          resultContainer.innerHTML = `<p style="color:red;">เกิดข้อผิดพลาด: ${data.error || 'ไม่สามารถค้นหาเส้นทางได้'}</p>`;
          return;
        }
        
        parseGoogleDirectionsResponse(data);
        
      } else {
        // ใช้ชื่อป้าย - ใช้ GET API เหมือนพิกัด
        const matched = allStops.find(stop => stop.stop_name === val);
        console.log(matched)
        if (!matched || !matched.lat || !matched.lon) {
          resultContainer.innerHTML = `<p style="color:red;">ไม่พบป้าย "${val}" ในระบบ</p>`;
          return;
        }
        
        // ✅ ใช้ Google Directions API ผ่าน Backend
        const url = `${process.env.NEXT_PUBLIC_API_BASE}/bus-routes/suggest-route?lat=${matched.lat}&lng=${matched.lon}&exLat=${exhibitionLatLng.lat}&exLng=${exhibitionLatLng.lng}`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (!res.ok) {
          resultContainer.innerHTML = `<p style="color:red;">เกิดข้อผิดพลาด: ${data.error || 'ไม่สามารถค้นหาเส้นทางได้'}</p>`;
          return;
        }
        
        parseGoogleDirectionsResponse(data);
      }
      
    } catch (error) {
      console.error('Error fetching routes:', error);
      resultContainer.innerHTML = `<p style="color:red;">เกิดข้อผิดพลาดในการเชื่อมต่อ</p>`;
    }
  };

  const displayGTFSRoutes = (data: any) => {
    const resultContainer = document.getElementById('routes-display')!;
    
    if (!Array.isArray(data) || data.length === 0) {
      resultContainer.innerHTML = `<p style="color:red;">${data?.message || 'ไม่พบเส้นทาง'}</p>`;
      return;
    }

    let html = '<div class="space-y-3">';
    
    data.forEach((route: any, index: number) => {
      html += `<div class="border rounded-lg p-3 bg-blue-50">`;
      html += `<h4 class="font-bold text-blue-800 mb-2">เส้นทางที่ ${index + 1}</h4>`;
      html += `<div class="text-sm mb-2">`;
      html += `<div><strong>📍 ขึ้นที่:</strong> ${route.get_on}</div>`;
      html += `<div><strong>🎯 ลงที่:</strong> ${route.get_off} <span class="text-gray-600">(${route.get_off_distance} เมตร จากจุดหมาย)</span></div>`;
      html += `</div>`;
      
      html += `<div class="flex items-center gap-2 mt-2">`;
      html += `<span class="text-xl">🚌</span>`;
      html += `<div>`;
      html += `<div class="font-semibold text-blue-600">สาย ${route.route.short_name} - ${route.route.long_name}</div>`;
      html += `<div class="text-xs text-gray-500">รวมระยะทาง: ${route.distance} เมตร</div>`;
      html += `</div>`;
      html += `</div>`;
      html += `</div>`;
    });
    
    html += '</div>';
    resultContainer.innerHTML = html;
  };

  if (loading) return (
    <div className="p-4">
      <InspiraNavbar />
      <div className="text-center mt-20">กำลังโหลดข้อมูล...</div>
    </div>
  );
  
  if (error) return (
    <div className="p-4">
      <InspiraNavbar />
      <div className="text-red-500 text-center mt-20">{error}</div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="fixed inset-0 -z-10 w-full h-full">
        <Image
          src="/bg-event.svg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="w-fit h-fit"
        />
      </div>
      
      <InspiraNavbar />
      
      <div className="relative mt-20 mb-6 text-center">
        <button 
          onClick={() => window.history.back()} 
          className="absolute left-0 top-1/2 -translate-y-1/2 !text-black px-4 py-2 rounded-lg text-[24px]"
        >
          ❮
        </button>
        <button 
          onClick={() => window.history.back()} 
          className="absolute right-0 top-1/2 -translate-y-1/2 !text-black px-4 py-2 rounded-lg text-[32px]"
        >
          ♡
        </button>

        <div>
          <h1 className="text-2xl font-bold text-blue-800 inline-block">
            {event?.title || 'Loading...'} {event?.title_en ? event.title_en.toUpperCase() : ''}
          </h1>
          {event?.categories && event.categories.length > 0 && (
            <div className="mt-4">
              {event.categories.map((category: string, index: number) => (
                <span key={index} className="inline-block px-4 py-1 text-xs bg-[#5372A4] !text-white rounded-full mr-2">
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold pt-4 text-[#5372A4] inline-block">
            Public Transport Directions
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
        {/* LEFT: Bus Stop Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold pt-4 !text-black inline-block">
            แผนการเดินทางที่แนะนำ
          </h1>
          <div className="grid gap-4">
            {busStops.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <p className="text-gray-500">ไม่พบป้ายรถเมล์ใกล้เคียง</p>
              </div>
            ) : (
              busStops.map((stop, index) => {
                const icon = getTransportIcon(stop.stop_name);
                const price =
                  stop.min_price == null || stop.max_price == null
                    ? 'ยังไม่มีข้อมูล'
                    : stop.min_price === stop.max_price
                    ? `${stop.min_price} บาท`
                    : `${stop.min_price} - ${stop.max_price} บาท`;
                const distance = stop.distance ? `${stop.distance} เมตร` : 'ไม่ทราบระยะทาง';

                return stop.routes && stop.routes.length > 0 ? (
                  stop.routes.map((route: any, rIndex: number) => (
                    <div
                      key={`${stop.stop_id || index}-${route.short_name}-${rIndex}`}
                      className="bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-3"
                    >
                      <div className="text-black font-semibold text-lg">{stop.stop_name}</div>
                      <div className="text-base text-gray-700">ระยะทาง : {distance}</div>

                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className="text-5xl">{icon}</div>
                          <div className="text-base text-black mt-1">{price}</div>
                        </div>

                        <div className="flex flex-col justify-center">
                          <div className="text-base text-black">
                            สาย <strong className="text-lg">{route.short_name}</strong> - {route.long_name?.split(';')[0] || 'ไม่ทราบชื่อเส้นทาง'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div key={`empty-${stop.stop_id || index}`} className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3">
                    <div className="font-semibold text-lg text-black">{stop.stop_name}</div>
                    <div className="text-base text-gray-700">ระยะทาง : {distance}</div>
                    <div className="flex flex-col items-center">
                      <div className="text-4xl">{icon}</div>
                      <div className="text-base text-black mt-1">{price}</div>
                    </div>
                    <div className="text-base text-gray-600 italic">ไม่มีข้อมูลเส้นทาง</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: Input + Map */}
        <div className="flex-1">
          <div className="text-center mb-3">
            <input
              list="stop-suggestions"
              id="startStopInput"
              placeholder="พิมพ์ชื่อป้าย หรือใช้พิกัดปัจจุบัน"
              className="m-1 p-2 rounded-md border w-3/4"
            />
            <datalist id="stop-suggestions">
              {allStops.map((stop) => (
                <option key={stop.stop_id} value={stop.stop_name} />
              ))}
            </datalist>
            <button 
              onClick={useMyLocation}
              className="m-1 px-3 py-2 rounded-md bg-yellow-300 hover:bg-yellow-400 transition"
            >
              📍 Use current location
            </button>
            <button 
              onClick={suggestRoutes}
              className="m-1 px-3 py-2 rounded-md bg-blue-800 text-white hover:bg-blue-900 transition"
            >
              🧭 Suggested Routes
            </button>
          </div>
          
          <div className="bg-white shadow-lg rounded-xl p-4 mt-4">
            <h3 className="font-semibold mb-2 text-lg">🚍 Suggested Routes</h3>
            <div id="routes-display" className="min-h-[100px]">กรุณาเลือกป้ายเริ่มต้น</div>
          </div>
          
          <h2 className="text-center font-bold text-lg mt-8">🗺️ Map</h2>
          <div id="map" className="w-full h-[500px] rounded-2xl shadow-lg mt-2 bg-gray-200 flex items-center justify-center">
            <div className="text-gray-500">Loading map...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
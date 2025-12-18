export const getActualDistance = async (originLat, originLng, destLat, destLng) => {
  try {
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': 'AIzaSyApeRJe3NFzGsTey20Xu8XEFrIxphxs4VM',
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.localizedValues'
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: {
              latitude: originLat,
              longitude: originLng
            }
          }
        },
        destination: {
          location: {
            latLng: {
              latitude: destLat,
              longitude: destLng
            }
          }
        },
        travelMode: 'TWO_WHEELER',
        units: 'METRIC'
      })
    });
    
    const data = await response.json();
    
    console.log(data, '>>>>>>>>>>>>>>>>>>>>>API DATA', url);

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      
      // Parse duration (comes as "123s" format)
      const durationInSeconds = parseInt(route.duration.replace('s', ''));
      
      return {
        success: true,
        distance: parseFloat((route.distanceMeters / 1000).toFixed(2)),
        distanceText: route.localizedValues?.distance?.text || `${(route.distanceMeters / 1000).toFixed(1)} km`,
        duration: Math.ceil(durationInSeconds / 60),
        durationText: route.localizedValues?.duration?.text || `${Math.ceil(durationInSeconds / 60)} mins`,
      };
    }
    
    return { success: false, error: 'NO_ROUTES_FOUND' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};



export const getMotorcycleDistance = async (originLat, originLng, destLat, destLng) => {
  const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': 'AIzaSyApeRJe3NFzGsTey20Xu8XEFrIxphxs4VM',
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
    },
    body: JSON.stringify({
      origin: {
        location: {
          latLng: {
            latitude: originLat,
            longitude: originLng
          }
        }
      },
      destination: {
        location: {
          latLng: {
            latitude: destLat,
            longitude: destLng
          }
        }
      },
      travelMode: 'TWO_WHEELER',
      units: 'METRIC'
    })
  });
  
  const data = await response.json();

  console.log(data,">>>>>>>>>>>>>>>>>DATTTTTTT   UPDATEDDDDD");
  return data;
};

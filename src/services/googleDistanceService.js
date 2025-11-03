export const getActualDistance = async (originLat, originLng, destLat, destLng) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&key=${"AIzaSyApeRJe3NFzGsTey20Xu8XEFrIxphxs4VM"}&mode=driving&units=metric`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const element = data.rows[0].elements[0];
      
      if (element.status === 'OK') {
        return {
          success: true,
          distance: parseFloat((element.distance.value / 1000).toFixed(2)),
          distanceText: element.distance.text,
          duration: Math.ceil(element.duration.value / 60),
          durationText: element.duration.text,
        };
      }
    }
    
    return { success: false, error: data.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

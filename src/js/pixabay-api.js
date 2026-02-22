import axios from "axios";

const API_KEY = "54653333-1a4d24954eec451e3cf04620f";
const BASE_URL = "https://pixabay.com/api/";


export async function getImagesByQuery(query, page) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
          q: query,
          page,
          per_page: 15,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
    },
  });
    

  return response.data;
}
getImagesByQuery()
    .then(data => {
        console.log(data)
    })
    .catch(error => {
     console.log(error)
})




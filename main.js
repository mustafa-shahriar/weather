import './style.css';

const api = "https://api.openweathermap.org/data/2.5/weather?";
const appid = "2055879f15c098af0d2997fc974eeb9d";

document.querySelector("#input").addEventListener("submit", (e)=>{
    e.preventDefault();
    const city = e.target[0].value;
    callApi(city);
})


async function callApi(city){
    const endpoint = `${api}q=${city}&appid=${appid}`;
    const res = await fetch(endpoint);
    try{
        if(!res.ok){
            throw new Error("error")
        }
        const json = await res.json();
        const data = await json;
        render(data);
    }catch(error){
        console.log(error);
    }
}

callApi("kabul");

const description = document.querySelector("#description");
const temp = document.querySelector("#temp");
const city = document.querySelector("#city-name");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const imgDescriptor = document.querySelector("#result-img");

function render(data){
    document.querySelector("#suggestion").innerHTML= "";
    description.innerHTML = data.weather[0].description;
    temp.innerHTML= (data.main.temp - 273.15).toFixed(2);
    humidity.innerHTML = data.main.humidity;
    windSpeed.innerHTML = data.wind.speed;
    city.innerHTML = data.name;
    imgDescriptor.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

async function callCitiesApi(){
    const res = await fetch("https://countriesnow.space/api/v0.1/countries");
    const json = await res.json();
    const data = await json;
    let citiesArray = [];
    data.data.forEach(element => {
        citiesArray.push(...element.cities);
    });
    autocomplete(document.querySelector("#form__input"),citiesArray);


}

callCitiesApi();




function autocomplete(inp, arr) {
    inp.addEventListener("input", (e)=>{
        if(e.target.value !== ""){
            const regex = new RegExp(e.target.value,"gi");
            let filterdArray = arr.filter((element)=>element.toLowerCase().startsWith(e.target.value.toLowerCase()))
            showSuggestion(filterdArray.slice(0,5));
        }else{
            document.querySelector("#suggestion").innerHTML= "";
        }
    })
}

function showSuggestion(array){
    const suggestionUl = document.querySelector("#suggestion");
    const inputField = document.querySelector("#form__input");

    suggestionUl.innerHTML = "";
    array.forEach((element)=>{
        const li = document.createElement("li");
        li.innerHTML = element;
        li.addEventListener("click",(e)=>{
            inputField.value = e.target.innerHTML;
            callApi(e.target.innerHTML);
            console.log(e.target.value);
            suggestionUl.innerHTML = "";
        })
        suggestionUl.appendChild(li);
    });

    document.querySelector("#input").addEventListener("keydown", focusOnALi);

    const listItems = document.querySelectorAll('#suggestion li');
    let focusedIndex = 0;
    function focusOnALi(event){
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            listItems[focusedIndex].classList.remove("focused");
            focusedIndex = focusedIndex > 0 ? focusedIndex - 1 : listItems.length - 1;
            listItems[focusedIndex].classList.add("focused");
            inputField.value = listItems[focusedIndex].innerHTML;
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            listItems[focusedIndex].classList.remove("focused");
            focusedIndex = focusedIndex < listItems.length - 1 ? focusedIndex + 1 : 0;
            listItems[focusedIndex].classList.add("focused");
            inputField.value = listItems[focusedIndex].innerHTML;
        }
    }
}



if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      
      async function callApi(city){
        const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${appid}`;
        const res = await fetch(endpoint);
        try{
            if(!res.ok){
                throw new Error("error")
            }
            const json = await res.json();
            const data = await json;
            render(data);
        }catch(error){
            console.log(error);
        }
    }
    callApi();
      
      
    });
  } else {
    console.log("Geolocation is not available in this browser.");
  }
  


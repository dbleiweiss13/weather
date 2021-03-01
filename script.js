$(document).ready(function () {

    var apiKey = "a61139917aee5ad23a8f9d7855c966cf"

    // localStorage.clear();

    var searchHistory = JSON.parse(localStorage.getItem('searchHistory'))

    // console.log(searchHistory)

    if (!searchHistory) {
        searchHistory = [];
    } else {
        searchHistory.forEach(e => {
            listSearches(e)
        });
    }

    $("#search").on("click", function () {
        var city = $("#cityName").val()
        listSearches(city);
        searchHistory.push(city)
        searchWeather(city)
        getForecast(city)

        localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
    })

    $(".list-group-item").on("click", function () {
        var search = $(this).attr("data-search")
        // console.log(search)
        searchWeather(search)
        getForecast(search)
    })

    function listSearches(search) {
        var li = $("<li>");
        li.addClass("list-group-item");
        li.text(search)
        li.attr("data-search", search)
        $("#searchList").append(li)
    }

    function searchWeather(city) {
        $("#weatherDiv").removeClass("hideAll")

        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey,
            dataType: "json"
        }).then(function (data) {
            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/uvi?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=" + apiKey,
                dataType: "json"
            }).then(function (uvData) {
                console.log(uvData)
                let uvIndex = uvData.value

                $("#currCityName").text(data.name + " (" + new Date().toLocaleDateString() + ")");
                $("#currCityName").append($("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"))

                $("#temperature").text("Wind Speed: " + data.wind.speed + " MPH");
                $("#humidity").text("Humidity: " + data.main.humidity + "%");
                $("#wind").text("Temperature: " + data.main.temp + " °F");
                $("#uv").text(uvIndex)
                if(uvIndex < 3) {
                    $("#uv").addClass("btn-success")
                    $("#uv").removeClass("btn-warning")
                    $("#uv").removeClass("btn-danger")
                } else if (uvIndex >= 3 && uvIndex < 7) {
                    $("#uv").removeClass("btn-success")
                    $("#uv").addClass("btn-warning")
                    $("#uv").removeClass("btn-danger")
                } else {
                    $("#uv").removeClass("btn-success")
                    $("#uv").removeClass("btn-warning")
                    $("#uv").addClass("btn-danger")
                }
            })
        })
    }

    function getForecast(city) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey,
            dataType: "json"
        }).then(function (data) {
            $("#forecastContainer").empty()
            data.list.forEach(e => {
                if (e.dt_txt.indexOf("00:00:00") !== -1) {
                    // console.log(e)
                    var col = $("<div>")
                    var div = $("<div>")
                    div.addClass("card-body p-2")

                    var div2 = $("<div>")
                    div2.addClass("card text-white bg-primary")

                    var date = $("<p>").text(new Date(e.dt_txt).toLocaleDateString())
                    var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + e.weather[0].icon + ".png")
                    var temp = $("<p>").text("Temp: " + e.main.temp_max + " °F")
                    var humidity = $("<p>").text("Humidity: " + e.main.humidity + "%")

                    div2.append(date, img, temp, humidity)
                    div.append(div2)
                    col.append(div)
                    $("#forecastContainer").append(col)
                }
            })
        });
    }

})

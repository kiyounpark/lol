const api_key = "RGAPI-51669250-6f4b-4763-8fe7-5db4be7f58e8";
document
  .getElementById("submitSummoner")
  .addEventListener("click", function () {
    var summonerName = document.getElementById("summonerName").value; // input에서 값을 가져옵니다.
    if (!summonerName) {
      // 입력 값이 없으면 에러 메시지를 표시합니다.
      document.getElementById("summonerInfo").innerText =
        "닉네임을 입력해주세요";
      return; // 함수를 여기서 종료합니다.
    }
    var sohwan = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
      summonerName
    )}?api_key=${api_key}`;
    loadSummonerInfo(sohwan); // API 호출 함수에 URL을 전달합니다.
  });

function loadSummonerInfo(sohwan) {
  // Fetch API를 사용하여 요청을 보냅니다.
  fetch(sohwan, {
    method: "GET", // HTTP 메소드 설정
    headers: {
      // 요청 헤더 설정
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
      "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
      Origin: "https://developer.riotgames.com",
    },
  })
    .then((response) => {
      // 응답의 상태 코드가 성공을 나타내는지 확인합니다.
      if (response.ok) {
        // 응답이 성공적이라면 JSON 형태로 파싱합니다.
        return response.json();
      } else {
        // 성공적이지 않다면 오류를 던집니다.
        throw new Error("Response not successful");
      }
    })
    .then((data) => {
      // JSON 데이터를 받아서 소환사 정보를 화면에 표시하는 함수를 호출합니다.
      displaySummonerInfo(data);

      getMatchListByPuuid(data.puuid);
    })
    .catch((error) => {
      // 오류가 발생하면 사용자에게 알리고 콘솔에도 기록합니다.
      console.error("Fetch error:", error);
      document.getElementById("summonerInfo").innerText =
        "소환사 정보를 불러오는 데 실패했습니다.";
    });
}

function displaySummonerInfo(summonerData) {
  // 소환사 데이터를 화면에 표시하는 코드를 작성합니다.
  // 여기에서는 예제로 몇 가지 기본 정보만 표시하도록 하겠습니다.
  const infoDiv = document.getElementById("summonerInfo");
  infoDiv.innerHTML = `
                <p>소환사 이름: ${summonerData.name}</p>
                <p>레벨: ${summonerData.summonerLevel}</p>
                <p>프로필 아이콘 ID: ${summonerData.profileIconId}</p>
                <p>puuid : ${summonerData.puuid}</p>
            `; // 실제로는 더 많은 정보를 표시할 수 있습니다.
}

// puuid 값을 사용하여 매치 리스트를 가져오는 함수입니다.
function getMatchListByPuuid(puuid) {
  const matchesUrl = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(
    puuid
  )}/ids?start=0&count=20&api_key=${api_key}
  `;

  fetch(matchesUrl, {
    method: "GET", // HTTP 메소드 설정
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
      "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
      Origin: "https://developer.riotgames.com",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((matchList) => {
      // 매치 리스트를 콘솔에 출력합니다.
      console.log(matchList);
    })
    .catch((error) => {
      console.error("Error fetching match list:", error);
    });
}

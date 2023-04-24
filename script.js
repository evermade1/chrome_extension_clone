function matching(user) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => document.querySelector("body").innerText
        }).then(result => {
            //console.log(JSON.stringify(result));
            // 위의 코드가 실행된 후에 이 함수를 호출해주세요. 그 때 result에 담아주세요. 

            //이 문서에서 body 태그 아래에 있는 모든 텍스트를 가져온다. 그 결과를 bodyText라는 변수에 담는다.
            var bodyText = JSON.stringify(result);
            //bodyText의 모든 단어를 추출하고, 그 단어의 숫자를 센다. 그 결과를 bodyNum이라는 변수에 담는다. 
            var bodyNum = bodyText.split(' ').length;
            //var myText = 'git'
            //bodyText에서 자신이 알고 있는 단어(the)가 몇 번 등장하는지를 알아본다. 그 결과를 myNum이라는 변수에 담는다.
            if (bodyText.match(new RegExp(user, 'gi')) == null) { var myNum = 0 }
            else { var myNum = bodyText.match(new RegExp(user, 'gi')).length; }
            var per = myNum / bodyNum * 100;
            per = per.toFixed(2);
            // id값이 result인 태그에 결과를 추가한다. 
            document.querySelector('#answer').innerText = '"'+ user + '" : ' + myNum + '/' + bodyNum + ' (' + (per) + '%)';
            document.querySelector('#user').value = null
        }).catch(error => console.log(error));
    })
}

//크롬 스토리지에 저장된 값 가져오기
chrome.storage.sync.get(function (data) {
    //#user의 값으로 data의 값 입력
    document.querySelector('#user').value = data.userWords;
    //분석해서 그 결과를 #answer에 넣기
    matching(data.userWords)
    
})

//컨텐츠 페이지의 #user 에 입력된 값이 변경되었을 때
document.querySelector('#user').addEventListener('keypress', function (e) {
    if (e.key == 'Enter') {
        //컨텐츠 페이지에 몇 개의 단어가 등장하는지 계산한다.
        var user = document.querySelector('#user').value;
        //크롬 스토리지에 입력값을 저장한다.
        chrome.storage.sync.set({
            userWords:user
        })
        matching(user)
    }

})
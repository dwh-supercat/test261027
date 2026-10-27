/* DWH 사내 테스트 설문 — index.html(설문)·results.html(결과지) 공용 데이터·로직. 문항은 SECTIONS 만 고친다. */
(function(){
  "use strict";
  var DWH = (window.DWH = window.DWH || {});

  DWH.SKEY   = "dwh-survey:";
  DWH.SCALE  = ["전혀 아니다","아니다","보통","그렇다","매우 그렇다"];
  // Google Apps Script 웹앱 URL(배포 후 여기에 붙여넣으면 전원이 설정 없이 제출·집계된다)
  DWH.ENDPOINT = "https://script.google.com/macros/s/AKfycbwZ7Z2SQSVx8-m4Q9V7nRjH8v9XmuDYQAlyVBl3SpgMzk3K72bCve09uiIc0fXksWbXNA/exec";

  // type: scale5 | choice(options) | text | textarea | bug(유/무 + 재현)
  DWH.SECTIONS = [
    { id:"s1", no:"01", cat:"개요", nav:"개요", title:"목적 · 대상",
      bodyHtml:
        '<p class="helper"><b>목적</b>: 사내 플레이 테스트에서 재미 · 밸런스 · UX · 안정성 이슈를 수집한다.</p>'+
        '<p class="helper"><b>대상</b>: 사내 테스터(기획 · 개발 · 아트 · QA). &nbsp; <b>소요</b>: 약 5분.</p>'+
        '<p class="helper"><b>별점(5점)</b>: 별이 많을수록 긍정입니다. 리뷰처럼 반 별(0.5점) 선택 가능. 1 전혀 아니다 ~ 5 매우 그렇다.</p>' },

    { id:"s2", no:"02", cat:"응답 정보", nav:"응답자·환경", title:"응답자 · 플레이 환경",
      helper:"분석 때 환경별로 묶어 보기 위한 기본 정보입니다.",
      fields:[
        { name:"name",     label:"성함",            type:"text",   ph:"이름 또는 닉네임" },
        { name:"email",    label:"이메일",          type:"email",  ph:"예: id@supercat.co.kr" },
        { name:"role",     label:"직군",            type:"choice", options:["기획","개발","아트","QA","기타"] },
        { name:"viewScale",label:"게임화면",        type:"choice", options:["기본","1.5배","2배"] },
        { name:"playtime", label:"누적 플레이 시간", type:"text",   ph:"예: 약 3시간" }
      ] },

    { id:"s3", no:"03", cat:"플레이 경험", nav:"첫인상·온보딩", title:"첫인상 · 온보딩",
      helper:"처음 켰을 때의 이해도와 초반 몰입을 봅니다.", scaleLegend:true,
      questions:[
        { no:"3-1", t:"처음 실행했을 때 무엇을 하는 게임인지 바로 이해됐다", type:"scale5" },
        { no:"3-2", t:"초반 안내 · 튜토리얼이 충분했다", type:"scale5" },
        { no:"3-3", t:"첫 10분이 재미있었다", type:"scale5" },
        { no:"3-4", t:"처음에 막히거나 헷갈린 지점이 있었다면 무엇인가", type:"textarea" }
      ] },

    { id:"s4", no:"04", cat:"플레이 경험", nav:"핵심 루프", title:"핵심 루프 · 방치 재미",
      helper:"방치형 핵심 루프(비접속 성장 → 접속 시 정리)의 만족도입니다.", scaleLegend:true,
      questions:[
        { no:"4-1", t:"비접속(방치) 중 성장 체감이 만족스럽다", type:"scale5" },
        { no:"4-2", t:"접속했을 때 할 일(수령 · 강화 · 편성)이 명확하다", type:"scale5" },
        { no:"4-3", t:"반복 플레이가 지루하지 않다", type:"scale5" },
        { no:"4-4", t:"다시 켜고 싶게 만드는 요소가 있다", type:"scale5" },
        { no:"4-5", t:"가장 재미있던 순간과 가장 지루했던 순간", type:"textarea" }
      ] },

    { id:"s5", no:"05", cat:"플레이 경험", nav:"전투", title:"전투",
      helper:"전투 가독성 · 인과 이해 · 편성 선택의 체감입니다.", scaleLegend:true,
      questions:[
        { no:"5-1", t:"전투에서 이기고 지는 원인이 이해된다", type:"scale5" },
        { no:"5-2", t:"데미지 · 회복 등 전투 숫자가 잘 읽힌다", type:"scale5" },
        { no:"5-3", t:"스킬 연출 · 타이밍이 명확하다", type:"scale5" },
        { no:"5-4", t:"편성(포메이션) 선택이 결과에 영향을 준다고 느꼈다", type:"scale5" },
        { no:"5-5", t:"전투에서 헷갈리거나 아쉬웠던 부분", type:"textarea" }
      ] },

    { id:"s6", no:"06", cat:"플레이 경험", nav:"성장·경제", title:"성장 · 경제 밸런스",
      helper:"강화 · 재화 흐름 · 진행 속도와 ‘벽’ 체감을 봅니다.", scaleLegend:true,
      questions:[
        { no:"6-1", t:"장비 강화 · 성장 속도가 적절하다", type:"scale5" },
        { no:"6-2", t:"재화 획득과 소비 흐름이 납득된다", type:"scale5" },
        { no:"6-3", t:"다음에 무엇을 할지(성장 목표)가 분명하다", type:"scale5" },
        { no:"6-4", t:"진행 중 막히는 ‘벽’을 느꼈다", type:"choice", options:["예","아니오"] },
        { no:"6-5", t:"‘벽’이 있었다면 어느 구간 · 레벨인가, 너무 빠르거나 느린 구간은", type:"textarea" }
      ] },

    { id:"s7", no:"07", cat:"인터페이스", nav:"UI·UX", title:"UI · UX (데스크톱 오버레이)",
      helper:"멀티창 오버레이 배치 · 창 조작 · 가독성 · 툴팁 · 드래그를 봅니다.", scaleLegend:true,
      questions:[
        { no:"7-1", t:"멀티창 오버레이 배치가 이해된다", type:"scale5" },
        { no:"7-2", t:"창 이동 · 정리가 편하다", type:"scale5" },
        { no:"7-3", t:"글자 · 아이콘 가독성이 좋다", type:"scale5" },
        { no:"7-4", t:"아이템 툴팁이 필요한 정보를 잘 보여준다", type:"scale5" },
        { no:"7-5", t:"아이템 드래그 · 병합 조작이 자연스럽다", type:"scale5" },
        { no:"7-6", t:"불편했던 UI 조작 · 창 배치", type:"textarea" }
      ] },

    { id:"s8", no:"08", cat:"안정성", nav:"성능·안정성", title:"성능 · 안정성 · 버그",
      helper:"발생 여부를 고르고, 있었다면 <b>재현 경로</b>(빌드 버전 · 조작 순서 · 시점)를 적어 주세요.",
      questions:[
        { no:"8-1", t:"크래시 · 강제 종료", type:"bug" },
        { no:"8-2", t:"프레임 저하 · 버벅임", type:"bug" },
        { no:"8-3", t:"로딩 · 접속 지연 · 끊김", type:"bug" },
        { no:"8-4", t:"창 포커스 · 표시 · 위치 이상", type:"bug" },
        { no:"8-5", t:"툴팁 · 아이콘 미표시 등 리소스 이상", type:"bug" },
        { no:"8-6", t:"기타 버그 · 데이터 이상", type:"bug" }
      ] },

    { id:"s9", no:"09", cat:"종합", nav:"종합", title:"종합 만족도 · 자유 의견",
      helper:"전반 평가와 우선순위 의견입니다.", scaleLegend:true,
      questions:[
        { no:"9-1", t:"전반적으로 만족스럽다", type:"scale5" },
        { no:"9-2", t:"지금 상태로 지인에게 추천하겠는가", type:"scale5" },
        { no:"9-3", t:"계속 플레이하고 싶다", type:"scale5" },
        { no:"9-4", t:"가장 좋았던 점 1가지", type:"textarea" },
        { no:"9-5", t:"가장 개선이 시급한 점 1가지", type:"textarea" },
        { no:"9-6", t:"자유 의견", type:"textarea" }
      ] },

    { id:"s10", no:"10", cat:"제출", nav:"제출", title:"응답 제출", custom:"submit",
      helper:"작성한 응답을 제출합니다." }
  ];

  DWH.flatten = function(){
    var RADIO = [], COLS = [], Q = [];
    DWH.SECTIONS.forEach(function(sec){
      if(sec.fields) sec.fields.forEach(function(f){
        COLS.push({ name:f.name, label:f.label });
        if(f.type==="choice") RADIO.push(f.name);
        Q.push({ name:f.name, no:f.label, text:f.label, type:f.type, options:f.options||null, sec:sec, meta:true });
      });
      if(sec.questions) sec.questions.forEach(function(q){
        var nm = "q"+q.no;
        // 라벨에 Q 접두어: 구글 시트가 "3-1" 등을 날짜로 자동변환하는 것 방지
        COLS.push({ name:nm, label:"Q"+q.no });
        if(q.type==="scale5"||q.type==="choice"||q.type==="bug") RADIO.push(nm);
        if(q.type==="bug") COLS.push({ name:nm+"r", label:"Q"+q.no+" 재현" });
        Q.push({ name:nm, no:q.no, text:q.t, type:q.type, options:q.options||(q.type==="bug"?["유","무"]:null), sec:sec });
      });
    });
    return { RADIO:RADIO, COLS:COLS, Q:Q };
  };

  DWH.resolveEndpoint = function(){
    try{ var u = localStorage.getItem(DWH.SKEY+"endpoint"); if(u) return u; }catch(e){}
    return DWH.ENDPOINT || "";
  };
  DWH.saveEndpoint = function(url){ try{ localStorage.setItem(DWH.SKEY+"endpoint", (url||"").trim()); }catch(e){} };

  // 응답 → 시트 전송용 { ts, header(라벨 순서), row(라벨:값) }
  DWH.buildSubmission = function(ans){
    var cols = DWH.flatten().COLS, header = cols.map(function(c){ return c.label; }), row = {};
    cols.forEach(function(c){ var v = ans[c.name]; if(v!=null && v!=="") row[c.label] = v; });
    return { ts:new Date().toISOString(), header:header, row:row };
  };

  // 시트 행(라벨:값) → answers(내부명:값). 결과지 집계가 이 형태를 쓴다.
  DWH.rowToAnswers = function(row){
    var byLabel = {}; DWH.flatten().COLS.forEach(function(c){ byLabel[c.label] = c.name; });
    var ans = {}; Object.keys(row||{}).forEach(function(k){ if(byLabel[k]) ans[byLabel[k]] = row[k]; });
    return ans;
  };
})();

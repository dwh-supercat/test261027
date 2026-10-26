[README.md](https://github.com/user-attachments/files/33959510/README.md)
# DWH 사내 테스트 설문 (정적 페이지 + Google Sheet)

Desktop Wallet Heroes(taskstonebar) 사내 플레이 테스트 피드백 수집용 설문/결과지.
빌드 없이 정적 HTML 로 돌아간다. **응답은 Google Sheet 에 한 행씩 쌓이고, 결과지가 시트를 읽어 자동 집계**한다.
테스터는 로그인·설치 없이 설문 링크만 열어 **제출하기** 한 번이면 끝난다.

## 구성

| 파일 | 역할 |
| --- | --- |
| `index.html` | 설문 작성 페이지. 제출 시 응답을 Apps Script 로 POST |
| `results.html` | 결과지(집계 대시보드). 시트를 읽어 문항별 평균·분포·주관식·버그를 집계 |
| `survey-data.js` | 문항 정의 + 공유 로직(두 페이지 공용). 맨 위 `DWH.ENDPOINT` 에 웹앱 URL 을 넣는다 |
| `apps-script.gs` | Google Apps Script 수집 엔드포인트(스프레드시트에 붙여넣어 배포) |

데이터 흐름: 테스터가 `index.html` 작성 → **제출하기**(POST) → Apps Script 가 Google Sheet 에 행 추가 → `results.html` 또는 시트에서 집계.

## 설치 (최초 1회)

1. **스프레드시트 생성**: 구글 드라이브에서 빈 스프레드시트 하나 만든다.
2. **Apps Script 배포**:
   - 스프레드시트 → 확장 프로그램 → Apps Script → `apps-script.gs` 내용을 `Code.gs` 에 붙여넣기.
   - 배포 → 새 배포 → 유형 **웹 앱** → 실행: **나**, 액세스: **모든 사용자** → 배포.
   - 나오는 웹 앱 URL(`.../exec`)을 복사.
3. **엔드포인트 연결**: `survey-data.js` 의 `DWH.ENDPOINT = "";` 에 복사한 URL 을 붙여넣는다.
4. **페이지 호스팅**(선택): 테스터에게 링크로 뿌리려면 정적 호스팅이 필요하다. GitHub Pages 예시:
   ```bash
   git push            # 이 저장소를 GitHub 에 올린 뒤
   # Settings → Pages → Source: Deploy from a branch, main / (root)
   ```
   `https://<owner>.github.io/<repo>/` 가 설문, `.../results.html` 이 결과지. (로컬 파일로 열어도 제출·집계는 동일하게 동작한다.)
5. **테스트 1건**: 설문을 열어 제출 → 시트에 첫 행이 들어오는지 확인한다(웹앱 배포가 올바른지 검증).

## 결과지 열람

- `results.html` 을 열면 `DWH.ENDPOINT` 로 **자동 집계**된다(토큰·로그인 불필요).
- 또는 Google Sheet 를 직접 열어 피벗 테이블·차트로 봐도 된다. 시트 열은 사람이 읽기 좋은 라벨(성함·직군·3-1·8-1 재현 …).
- 직군 필터, 집계/원본 CSV 내보내기 지원.

## 문항 수정

`survey-data.js` 의 `SECTIONS` 배열만 고치면 설문·탭·목차·결과지 집계가 함께 갱신된다.
Apps Script 는 그대로 둔다(새 문항 열은 제출 데이터에 맞춰 시트에 자동 추가).

## 공개 범위 (중요)

- 웹앱을 **모든 사용자** 액세스로 배포하므로, URL 을 아는 사람은 응답을 **제출(POST)** 하거나 **전체 응답을 읽을(GET)** 수 있다. 사내 저마찰 설문 기준에서는 보통 수용 가능하다.
- 더 막고 싶으면 Apps Script 에 **공유 비밀키**를 넣어(요청에 키가 없으면 거부) index/results 에서 같은 키를 붙여 보내도록 할 수 있다. 필요 시 추가한다.
- 응답에 이메일 등 개인정보가 들어가므로 시트 공유 범위(편집자/뷰어)는 내부로 제한한다.

## 로컬 미리보기

`index.html` 을 브라우저로 열면 된다(빌드 불필요). 로컬 서버가 필요하면:
```bash
python -m http.server 8000   # → http://localhost:8000/
```

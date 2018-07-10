# Infomation protect
- project repository
- 프로젝트에 contribute 하기위해서 project owner 가 contributor 로 추가해줘야한다.
- 추가하려는 email 은 개인 profile > setting 에서 email 을 공개해줘야한다.
- contributor 가 되기 위해서 repository 를 fork 해야한다.

## push를 하기 전에
push를 하기 전에 꼭 자신의 PC에 백업 폴더를 하나 만들어 놓는것이 좋다.
git상 최신으로 올라온 자료를 다운 받으면서 필요없는 부분이나 삭제된 부분이 전부 반영되기 때문에 작업한 내용이 전부 날아갈 수 있기 때문이다.
물론 redo를 사용하면 되긴 하지만 까다롭기 때문에 꼭 backup을 추천한다.

***
## git config
1. 로컬에서 프로젝트를 다운받으려는 폴더로 이동
```
$ cd {path}
```
2. git init 설정
```
$ git init
```
3. git global 설정
```
$ git config --global user.name {username}
$ git config --global user.email {email}
```
4. 프로젝트 clone
```
$ git clone git@github.com:gahu/BIBS.git
```
5. 프로젝트의 push url 설정
백업 프로젝트를 만들어서 fork한 후 branch를 여기로 따는 방법.
- 프로젝트 push 는 fork 된 프로젝트로 (ex) gahu/BIBS
- merge request 는 본 프로젝트로 (ex) gahu/BIBS
```
$ git remote add origin git@github.com:gahu/BIBS.git
$ git remote set-url --push origin git@github.com:gahu/BIBS.git
```
5. remote 경로가 다음과 같으면 정상적으로 remote 가 설정된 것
- push url 은 fork 된 프로젝트
- fetch(pull) url 은 본 프로젝트
```
$ git remote -v
origin	git@github.com:gahu/BIBS.git (fetch)
origin	git@github.com:gahu/BIBS.git (push)
```
이대로 행해지지 않아도 무관하며 fetch와 push를 동일시 하더라도 할 수 있다.

6. 다운받은 프로젝트 폴더로 이동
```
$ cd BIBS
```

## project push 정책
1. 모든 contributor 는 로컬에서 개인 branch 를 따서 작업한다.
- Merge request 는 fork 한 repository 에 새로운 브랜치를 따서 등록한다.
```
$ git branch {작업브랜치명}
```
2. push 하기 전에는 항상 로컬 master branch 로 이동해 최신분을 pull 받고, push 하려는 branch 를 최신 상태로 만들어준다.
```
$ git checkout master
$ git pull
$ git checkout {작업브랜치명}
$ git rebase master
```
3. remote 프로젝트로 push 한다. (remote 프로젝트의 master 브랜치가 아닌 다른 브랜치로 push)
```
$ git add .
$ git commit -am "{작업내용}"
$ git push origin {작업브랜치명}
```
4. [gahu/BIBS](https://github.com/gahu/BIBS.git/pulls)에서 "pull Request" 를 생성한다.
- pull Request 의 commit message 를 통해 어떤 이슈에대한 내용을 해결했는지에 대한 태깅을 해준다. ex) resolve #{이슈번호} {커밋내용}
5. 프로젝트 owner 가 request 를 확인해 push 한 내용을 머지해준다.
6. Merge request 이후 머지된 브랜치는 가능한 삭제하고, 새로운 브랜치를 따서 새로운 작업을 진행할 수 있도록 한다.
```
$ git checkout master
$ git pull
$ git branch -D {작업브랜치명}
$ git checkout -b {새로운브랜치명}
```
- 브랜치를 제거한 경우 로컬에서 트래킹 중인 remote 브랜치 정보를 제거해 준다.
```
# 트래킹 중인 remote branch 가 있는 경우 서버에서 삭제되면 로컬에서도 리모트 브랜치 정보가 삭제됨.
$ git fetch -p
```
***
- git pull 충돌시 요령
git을 이용하다가 pull을 했을때 아래와 같이 충돌이 나는 경우가 생긴다.
```
[oops]$ git pull

remote: Counting objects: 99, done.

remote: Compressing objects: 100% (68/68), done.

remote: Total 69 (delta 51), reused 0 (delta 0)

Unpacking objects: 100% (69/69), done.

From 10.25.1.20:/work/git/oops

   dab9a8b..b49cd63  master     -> origin/master

Updating dab9a8b..b49cd63

error: Your local changes to the following files would be overwritten by merge:

        Makefile

Please, commit your changes or stash them before you can merge.

Aborting
```
이때, 작업중인 IDE를 정상종료하고 다음의 명령어를 사용한다.
```
1. git add -A
1. git stash / git stash pop
2. git pull
```
그럼 작업이 남아있던 부분이 사라지고 정상적으로 git pull을 할 수 있게 된다.
[stash와 관련된 내용]: (http://wit.nts-corp.com/2014/03/25/1153)

## coding convention
- 개발 tool 은 Atom 를 사용한다.
- beautify 플러그인을 설치해 코드 포맷을 맞춘다.(메뉴 > 편집 > beautify 선택)

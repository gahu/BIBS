const { ADMIN_PASS: adminPass } = process.env;

exports.login = (ctx) => {
    const { password } = ctx.request.body;
    if(adminPass === password) {
        ctx.body = {
            success: true
        };
        // 로그인에 성공하면 logged 값을 true로 설정
        ctx.session.logged = true;
    } else {
        ctx.body = {
            success: false
        };
        ctx.status = 401; // Unauthorized
    }
};

exports.check = (ctx) => {
    ctx.body = {
        // ! 문자를 두 번 입력하여
        // 값이 존재하지 않을 때도 false를 반환하도록 설정한다.
        logged: !!ctx.session.logged
    };
};

// 세션에 값을 설정할 때는
// 'ctx.session.이름 = 값' 형식을 사용
// 조회할 때는
// 'ctx.session.이름' 형식을 사용
// 세션을 파기할 때는
// 'ctx.session = null'
exports.logout = (ctx) => {
    ctx.session = null;
    ctx.status = 204; // No Content
};
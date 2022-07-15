import { NextRequest, NextResponse} from "next/server";

export function middleware(req) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
        const auth = basicAuth.split(' ')[1];
        const [user, pwd] = atob(auth).split(':');

        if (user === 'favish' && pwd === 'favish') {
            return NextResponse.next();
        }
    }

    return new NextResponse(null, {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        }
    })
}
import nock from 'nock';
import { PrismaClient } from "@prisma/client";
import env from "../../src/config/env";
import request from "supertest";
import app from "../../src/app"; 


const prisma = new PrismaClient(
    {
        log: ['query', 'info', 'warn', 'error']
    }
);


const paymentToken = 'w78s59wr6tg3u6j5i8d6s4a59t6g3v5w';



export const mockPaymentCreateSuccess = () => {
    const scope = nock(env.GATEWAY_BASE_URL)
        .persist(false)
        .post('/OnlinePG/OnlinePG')
        .reply(200, {
            "status": 1,
            "token": paymentToken
        });
        // scope.on('request', (req, interceptor, body) => {
        //     console.log('interceptor matched request', interceptor.uri, body)
        //   });
        // scope.on('replied', (req, interceptor) => {
        //     console.log('response replied with nocked payload', interceptor.uri)
        //   });
};

export const mockPaymentCreateFailure = () => {
    const scope = nock(env.GATEWAY_BASE_URL)
    .post('/OnlinePG/OnlinePG')
    .reply(400, {
        "status": -1,
        "errorCode":"5",
    });
};

export const mockPaymentVerifySuccess = async ( orderId: any ) => {
    const testPayment = await prisma.payment.findFirst({
        where: { orderId }
    });

    const scope = nock(env.GATEWAY_BASE_URL)
    .post('/verifyTxnRandomSessionkey/ipg/VerifyTransaction')
    .reply(200, {
        ResultCode: 0,
        Success: true
    })
    
    const res = await request(app)
        .post('/api/customer/payments/verify')
        .send({
            RefNum: "1234567891234567890",
            ResNum: testPayment?.resNum  ,
            Status: '2',
            TraceNo: "2222222222"
    });
};

export const mockPaymentVerifyFailure = async ( orderId: any ) => {
    const testPayment = await prisma.payment.findFirst({
        where: { orderId }
    });
    const scope = nock(env.GATEWAY_BASE_URL)
    .post('/verifyTxnRandomSessionkey/ipg/VerifyTransaction')
    .reply(200, {
        ResultCode: 3,
        Success: false
    })

    const res = await request(app)
        .post('/api/customer/payments/verify')
        .send({
            RefNum: "1234567891234567891",
            ResNum: testPayment?.resNum  ,
            Status: '1',
            TraceNo: "1111111111"
    });

};
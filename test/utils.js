/**
 * Created by Uchenna on 1/28/2017.
 */
import {handleBatchResponse} from "../src/utils"

const apiContext={emit:()=>{},_debug:()=>{}}
import sinon from 'sinon';
import {fixtures,batchResponse} from "./test-utils"
const fakeMails = fixtures.getData(2)
const context=sinon.stub(apiContext)
module.exports=function(test){

    test("handleBatchResponse - responseCode 200 returns batch response object ",(t)=>{
        //t.plan(1)
        const callback = sinon.spy()
        const result = batchResponse(fakeMails)
        handleBatchResponse.call(context,result,{statusCode:200},callback)
        t.deepEqual(callback.args[0][1],{errors:{0:result[0]},success:{1:result[1]}},'returns batch response object')
        t.end()
    })

    test("handleBatchResponse - error result returns error in callback ",(t)=>{
      //t.plan(1)
      const callback = sinon.spy()
      const result = new Error("Some error")
      handleBatchResponse.call(context,result,null,callback)
      t.ok(callback.calledWithExactly(result),'returns error in callback')
      t.end()
    })


    test("_handleBatchResponse - responseCode not 200 returns error in callback",(t)=>{
      //t.plan(1)
        const callback = sinon.spy()
        const err = new Error('Request failed with 400')
        err.statusCode=400
        const result = batchResponse(fakeMails)
        handleBatchResponse.call(context,result,{statusCode:400},callback)
        t.deepEqual(callback.args[0][0],err,'returns batch response object')
        t.end();
    })
}

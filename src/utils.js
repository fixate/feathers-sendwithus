/**
 * Created by Uchenna on 1/28/2017.
 */

const _processResults=(results)=>{
    const errors ={},success={}
    results.forEach((result,indx)=>{
        if(result.status_code === 200){
            success[indx] = result
        }else{
            errors[indx] = result
        }
    })
    return {errors,success}
}


export const handleBatchResponse=function(result,response,callback){
    if (result instanceof Error) {
        this._debug('Request Error: ' + result.stack);
        if (typeof callback == 'function') {
            callback(result);
        }
    } else if (response.statusCode === 200) {
        this.emit('response', response.statusCode, result, response);
        this._debug('Response 200: ' + JSON.stringify(result));
        if (typeof callback == 'function') {
            callback(null, _processResults(result));
        }
    } else {
        this.emit('response', response.statusCode, result, response);
        this._debug('Response ' + response.statusCode + ': ' + JSON.stringify(result));

        let err = new Error('Request failed with ' + response.statusCode);
        err.statusCode = response.statusCode;
        if (typeof callback == 'function') {
            callback(err);
        }
    }
}

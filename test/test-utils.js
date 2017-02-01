/**
 * Created by Uchenna on 1/28/2017.
 */
import faker from "faker"

const getD =(d)=> {
    return {
        body:d,
        method:"POST",
        path:"/api/v1/send"
    }
};

export const batchFixture = (data)=>{
    return data.map(d=>{
      return  getD(d)
    })
}

export const batchResponse = (data)=>{
    const results=[]
    for (let i = 0; i < data.length; i++) {
        const code = (i%2==0)?400:200;
      results.push(Object.assign({},getD(data[i]),{status_code:code})) ;

    }
    return results
}

export const fixtures = {
    getData:function(count){
        const results=[]
        for (let i = 0; i < count; i++) {
            results.push({
                template: 'theId',
                recipient: { address: faker.internet.email() },
                sender: { address: faker.internet.email() }
            })
        }
        return results
    }
}
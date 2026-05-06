const dns2 = require('dns2')
// import { Rules } from './rules'

const dns = new dns2({
    dns: '8.8.8.8'
});

const {Packet} = dns2

const server = dns2.createServer({
    udp : true,
    handle : async (req, send, rinfo) =>{ 
        const response = dns2.Packet.createResponseFromRequest(req);
        const domain = req.questions[0].name;
        console.log(`received a query from :"${domain}`)

        if(domain == 'facebook.com'){
            response.answers.push({
                domain,
                type: Packet.TYPE.A,
                class: Packet.CLASS.IN,
                ttl:300,
                address: '0.0.0.0'
            });
            send(response);
        }else{
            reply = await dns.resolveA(domain);
            response.answers.push(reply)
            send(response);
        }

        //Send the response to the client
        
    }
})


server.listen({udp : 5354})
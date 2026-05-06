const dns2 = require('dns2')
const routes = require('./rules.js')

// This is the DNS used when we dont want to poison
const dns = new dns2({
    dns: '8.8.8.8'
});
const {Packet} = dns2


const server = dns2.createServer({
    udp : true,
    handle : async (req, send, rinfo) =>{ 
        const response = dns2.Packet.createResponseFromRequest(req);
        const domain = req.questions[0].name;
        console.log(`received a query from :${domain}`)

        if(routes.has(domain)){
            response.answers.push({
                domain,
                type: Packet.TYPE.A,
                class: Packet.CLASS.IN,
                ttl:300,
                address: routes.get(domain)
            });
            console.log("Poisoned Ip: " + JSON.stringify(routes.get(domain)))
            send(response);
        }else{
            reply = await dns.resolveA(domain);
            reply.answers.forEach(address => {
                response.answers.push(address)
            });
            console.log("Ips given to client")
            response.answers.forEach( address => {console.log(address.address)})
            send(response);
        }
    }
})

server.listen({udp : 5354})
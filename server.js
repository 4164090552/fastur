require('http').createServer(function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    if (request.method == "GET") {
        var data = JSON.parse(require("fs").readFileSync("./data.json", "utf8"));
        var sites = data["homes"];
        var homes = Object.keys(sites);
        var stripe = require('stripe')(LIVE_KEY);

        if (request.url == '/config') {
            async function config() {
                var prices = await stripe.prices.list({
                    lookup_keys: ["fastur", "fastur_enterprise"],
                    expand: ['data.product']
                });
                response.end(JSON.stringify({ publishableKey: LIVE_KEY, prices: prices.data }));
            };
            config();
        } else if (request.url == '/invoice-preview') {
            async function invoice() {
                var customerId = req.cookies['customer'];
                var priceId = process.env[req.query.newPriceLookupKey.toUpperCase()];

                var subscription = await stripe.subscriptions.retrieve(
                    req.query.subscriptionId
                );

                var invoice = await stripe.invoices.retrieveUpcoming({
                    customer: customerId,
                    subscription: req.query.subscriptionId,
                    subscription_items: [{
                        id: subscription.items.data[0].id,
                        price: priceId,
                    }],
                });

                response.end(JSON.stringify({ invoice }));
            };
            invoice();
        } else if (request.url == '/subscriptions') {
            async function subscription() {
                // Simulate authenticated user. In practice this will be the
                // Stripe Customer ID related to the authenticated user.
                var customerId = req.cookies['customer'];

                var subscriptions = await stripe.subscriptions.list({
                    customer: customerId,
                    status: 'all',
                    expand: ['data.default_payment_method'],
                });

                response.end(JSON.stringify({ subscriptions }));
            };
            subscription();
        } else if (request.url.split("/")[1] == "messages") {
            if (request.url.split("/")[2] != "undefined.jpg") {
                var a = require("fs").readFileSync("/var/www" + request.url);
                response.end(a);
            }
        } else if (homes.includes(request.url.split("/")[1])) {
            var a = request.url.split("/")[1];
            var data = JSON.parse(require("fs").readFileSync("./data.json", "utf8"));
            var sites = data["homes"];
            var bird = sites[a]

            response.writeHeader(200, {
                "Content-Type": "text/html"
            });

            var page = require("fs").readFileSync("/var/www/" + a + "/" + bird + "/index.html")
            response.end(page);
        } else if (request.url == "/found") {
            var a = `
            <!DOCTYPE HTML> <html lang="en"> <head> <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" /> <title>Page not found</title> <style> html {font-size: 15pt; height: 100%; } body {background: #24252d; font-family: Arial, Helvetica, sans-serif; color: #bbb; line-height: 1.5; text-align: center; display: flex; align-items: center; height: 100%; flex-direction: column; justify-content: center; } h1 {color: #fff; margin: 0; } @media screen and (max-width: 736px) {html {font-size: 11pt; } } </style> </head> <body> <h1>Page not found</h1> <p>Sorry, the requested page could not be found.</p> </body> </html>`;
            response.end(a);
        } else if (request.url == "/bird.png" || request.url == "/girl.jpg" || request.url == "/favicon.png") {
            var bird = require("fs").readFileSync("./Archive" + request.url);
            response.end(bird);
        } else if (request.url.split("/")[1] == "edit") {
            var a = request.url.split("/")[2];
            var b = request.url.split("/")[3];
            var file = require("fs").readFileSync("/var/www/" + a + "/" + b + "/index.html");

            response.writeHeader(200, {
                "Content-Type": "text/html"
            });

            done = 1;
            response.end(file);

        } else if (request.url.split("/")[1] == "t") {
            var a = request.url.split("/")[2];
            var b = request.url.split("/")[3];
            var file = require("fs").readFileSync("/var/www/" + a + "/" + b + "/index.html");

            response.writeHeader(200, {
                "Content-Type": "text/html"
            });
            done = 1;
            response.end(file)
        } else if (request.url[0] == "/") {
            var Q = require('url').parse(request.url, true).query;
            var buy = Q.buy;
            var bird = Q.bird;
            var test = Q.test;
            var dash = Q.dash;
            var paid = Q.paid;
            var site = Q.site;
            var user = Q.user;
            var berta = Q.berta;
            var photo = Q.photo;
            var stripe = Q.stripe;
            var price = Q.price;
            var status = Q.status;
            var analytics = Q.analytics;
            var distribute = Q.distribute;
            var done = 0;

            var results = "";
            if (berta) {
                done = 1;
                var erin = 0;
                var busy = 0;

                var everything = ["who", "what", "where", "why", "how"];

                var words = [];
                if (berta.includes(" ")) {
                    var str = "";
                    for (var i = 0; i < berta.length; i++) {
                        if (berta[i] == " ") {
                            words.push(str);
                            str = "";
                        } else if (parseInt(i) == berta.length - 1) {
                            str += berta[i];
                            words.push(str);
                        } else {
                            str += berta[i];
                        }
                    }
                    for (var i in words) {
                        if (everything.indexOf(words[i])) {
                            berta = words[parseInt(i) + 2];
                            busy = 1;
                            break;
                        }
                    }

                } else {
                    berta = berta;
                    busy = 1;
                }


                if (busy == 0) {
                    function longest(arr) {
                        return arr.reduce((a, b) => a.length < b.length ? b : a, "");
                    }
                    berta = longest(words);
                }

                console.log(berta)
                var uri = "https://en.m.wikipedia.org/wiki/" + berta.charAt(0).toUpperCase() + berta.slice(1);;
                require("https").get(uri, res => {
                    res.setEncoding("utf8");
                    let body = "";
                    res.on("data", data => {
                        body += data;
                    });
                    res.on("end", () => {
                        var cheerio = require("cheerio");
                        var $ = cheerio.load(body);
                        $(".mw-empty-elt,.nowrap,.noexcerpt,note,style,sup,#toc,span,.mw-ui-icon").remove();
                        var truthy = 0;
                        $("p").each(function (i, e) {
                            var content = $(this).text();
                            if (!content.includes("displaystyle") && !content.includes("textstyle")) {
                                if (truthy != 0) {
                                    return false;
                                };
                                if (!content.includes("may refer to")) {
                                    content = content.toLowerCase().replace(/<img .*?>/g, "").replace(/[^a-z0-9. -]/g, "");
                                }
                                truthy++;
                                global.seed = content;
                                erin = 1;
                            }
                        });
                    });

                });

                var iteration = 0;
                function render(seed, word, length) {

                    global.preceding_word = "The";

                    global.probabilities = {}, global.truth = []; global.compliments = {}, compliments[word] = [], global.precedings = {}, precedings[word] = [], seeds = seed.split(" "), preceding_word = word, global.good = "";

                    for (var i in seeds) {
                        if (seeds[i] == word) {
                            truth.push({ word: word, preceding: seeds[parseInt(i) - 1], compliments: seeds[parseInt(i) + 1] })
                            compliments[word].push(seeds[parseInt(i) + 1]);
                            precedings[word].push(seeds[parseInt(i) - 1]);
                        }
                    }

                    if (compliments[word]) {
                        //is preceding word in precedings of corpus
                        var check = 0;
                        for (var i in truth) {
                            if (truth[i].preceding == preceding_word && truth[i].compliments !== " ") {
                                good = truth[i].compliments;
                                check = 1;
                                break;
                            }
                        }
                        if (check == 0) {
                            compliments[word] = compliments[word].filter(function (element) {
                                return element !== undefined;
                            });

                            var ftw = Math.floor(Math.random() * compliments[word].length);
                            good = compliments[word][ftw];
                        }
                    }
                    //hi i am human: hello i am joseph: am: next word depends on if previous words contained either hi or hello

                    if (iteration < length) {
                        if (good !== "undefined" && good !== undefined) {
                            results += good + " ";
                        }
                        iteration++
                        render(seed, good, 300)
                    }
                    word = good;
                }
                function waitForElement() {
                    if (erin == 1) {
                        console.log(erin, seed)
                        render(seed, "the", 300)
                        response.end(results);
                    } else {
                        setTimeout(waitForElement, 59);
                    }
                }
                waitForElement()
            }
            if (test) {
                done = 1;
                var data = JSON.parse(require("fs").readFileSync("./data.json", "utf8"));
                var list = data["list"];

                if (list.includes(test)) {
                    var userList = [];
                    require("child_process").exec("cd /var/www/" + user + " && ls", (err, stdout, stderr) => {
                        var b = stdout.split("\n");
                        b = b.filter(Boolean);
                        userList = b;
                        if (userList.includes(test)) {
                            response.end("1")
                        }
                        if (!userList.includes(test)) {
                            response.end("0");
                        }

                    });



                } else {
                    response.end("1");
                }
            }
            if (photo) {
                var photo = require("fs").readFileSync("/var/www/photos/" + photo);
                response.end(photo);
            }
            if (distribute) {
                done = 1;
                var distributions = JSON.parse(require("fs").readFileSync("./distributions", "utf8"));
                var specific_distribution = distributions[distribute];
                response.end(JSON.stringify(specific_distribution));
            }
            if (analytics) {
                done = 1;
                var a = JSON.parse(require("fs").readFileSync("./analytics", "utf8"));
                response.end(JSON.stringify(a.length));
            };
            if (buy) {
                done = 1;
                async function buy() {
                    var priced = price + "00";
                    var stripe = require('stripe')(LIVE_KEY);
                    var session = await stripe.checkout.sessions.create({
                        line_items: [{
                            price: buy,
                            quantity: 1,
                            currency: 'cad',
                            amount: priced,
                            name: site
                        }],
                        mode: "payment",
                        success_url: 'https://fastur.com',
                        cancel_url: 'https://fastur.com',
                        payment_intent_data: {
                            application_fee_amount: priced * 0.30,
                        },
                    }, {
                        stripeAccount: connect,
                    });
                    response.end(session.url);
                };
                buy();
            }
            if (stripe == "connect") {
                done = 1;
                async function onboard() {
                    var stripe = require('stripe')(LIVE_KEY);
                    var account = await stripe.accounts.create({
                        type: 'standard',
                        email: email,
                        business_profile: {
                            name: user
                        }
                    });
                    var data = JSON.parse(require("fs").readFileSync("./data.json", "utf8"));
                    var users = data["users"];
                    for (var i in users) {
                        if (users[i].email == email) {
                            users[i].connect = account.id;
                        }
                    };
                    data["users"] = users;
                    require("fs").writeFileSync("./data.json", JSON.stringify(data));

                    var accountLink = await stripe.accountLinks.create({
                        account: account.id,
                        refresh_url: 'https://fastur.com',
                        return_url: 'https://fastur.com',
                        type: 'account_onboarding'

                    });
                    response.end(accountLink.url);
                };
                onboard();
            }
            if (user == "templates") {
                done = 1;
                var data = JSON.parse(require("fs").readFileSync("./data.json", "utf8"));
                var sites = data["templates"];
                response.end(JSON.stringify(sites));
            }
            if (bird) {
                done = 1;
                var data = JSON.parse(require("fs").readFileSync("./data.json", "utf8"));
                var sites = data["homes"];
                sites[user] = bird;
                data["homes"] = sites;
                require("fs").writeFileSync("./data.json", JSON.stringify(data));
                response.end(bird + " is now your Home page.");
            }
            if (status) {
                done = 1;
                var data = JSON.parse(require("fs").readFileSync("./data.json", "utf8"));
                var sites = data["templates"];
                if (status == "paid") {

                    async function paid_status() {
                        var stripe = require('stripe')(LIVE_KEY);
                        var product = await stripe.products.create({
                            name: site
                        });
                        var extra = "";

                        var stripe_price = await stripe.prices.create({
                            unit_amount: price + "00",
                            currency: 'cad',
                            product: product.id,
                        });

                        var str = user + "/" + site;
                        removeIndex = sites.map(item => item.site).indexOf(str);
                        ~removeIndex && sites.splice(removeIndex, 1);
                        var data = JSON.parse(require("fs").readFileSync("./data.json", "utf8"));
                        var users = data["users"];
                        var connect_id;
                        for (var i in users) {
                            if (users[i].name == user) {
                                connect_id = users[i].connect
                            }
                        };
                        sites.push({ "connect": connect_id, "site": user + "/" + site, "price": price, "price_id": stripe_price.id });
                        data["templates"] = sites;
                        require("fs").writeFileSync("./data.json", JSON.stringify(data));
                        response.end(site + " is now on sale for $" + price + extra + ".");
                    };
                    paid_status();
                }
                if (status == "template") {
                    var str = user + "/" + site;
                    removeIndex = sites.map(item => item.site).indexOf(str);
                    ~removeIndex && sites.splice(removeIndex, 1)
                    sites.push({ "site": user + "/" + site, "price": price });
                    data["templates"] = sites;
                    require("fs").writeFileSync("./data.json", JSON.stringify(data));
                    response.end(site + " is now a public template.");
                }
                if (status == "private") {
                    var str = user + "/" + site;
                    removeIndex = sites.map(item => item.site).indexOf(str);
                    ~removeIndex && sites.splice(removeIndex, 1)
                    data["templates"] = sites;
                    require("fs").writeFileSync("./data.json", JSON.stringify(data));
                    response.end(site + " is now private.");
                }
            }
            if (paid) {
                done = 1;
                var a = JSON.parse(require("fs").readFileSync("./data.json", "utf8"));
                var paid_users = a["paid"];
                var users = a["users"];
                var flag = 0;
                if (paid_users.includes(paid)) {
                    for (var i in users) {
                        if (users[i].name == user) {
                            flag = 1;
                            users[i].paid = paid;
                        }
                    }
                }
                if (flag == 1) {
                    a["users"] = users;
                    require("fs").writeFileSync("./data.json", JSON.stringify(a));
                    response.end("Succesfully connected to payment card");
                } else {
                    response.end("Couldnt Find User with that ID");
                }
            }
            if (dash) {
                done = 1;
                require("child_process").exec("cd /var/www/" + user + " && ls", (err, stdout, stderr) => {
                    var b = stdout.split("\n");
                    b = b.filter(Boolean);
                    var arr = [];
                    for (var i in b) {
                        var c = b[i];
                        arr.push({
                            name: c
                        });
                    }

                    response.end(JSON.stringify(arr));
                });
            }
            if (request.url.split("/")[1] && !request.url.includes("?")) {
                done = 1;
                var a = `<!DOCTYPE HTML> <html lang="en"> <head> <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" /> <title>Account not found</title> <style> html {font-size: 15pt; height: 100%; } body {background: #24252d; font-family: Arial, Helvetica, sans-serif; color: #bbb; line-height: 1.5; text-align: center; display: flex; align-items: center; height: 100%; flex-direction: column; justify-content: center; } h1 {color: #fff; margin: 0; } @media screen and (max-width: 736px) {html {font-size: 11pt; } } </style> </head> <body> <h1>Account not found</h1> <p>Sorry, the requested account could not be found.</p> </body> </html>`;
                response.end(a);
            }
            if (done == 0) {
                var analytics = JSON.parse(require("fs").readFileSync("./analytics", "utf8"));
                var geoip = require('geoip-lite');
                var ip = request.headers['x-forwarded-for'];
                var geo = geoip.lookup(ip);
                geo.referer = request.headers["referer"];
                geo.time = Date.now();
                geo.ip = ip;
                if (geo) {
                    analytics.push(geo);
                    require("fs").writeFileSync("./analytics", JSON.stringify(analytics))
                }
                var a = require("fs").readFileSync("./index.html", "utf8");
                response.end(a);
            }
        }
    }
    if (request.method == 'POST') {
        var body = ''
        request.on('data', function (data) {
            body += data
        })
        request.on('end', function () {
            try {
                body = JSON.parse(body);
            } catch (e) { };

            var stripe = require('stripe')(LIVE_KEY);
            
            if (body.type == 'config_send') {
                async function config_send() {
                    var amount = body.items;
                    console.log(body);
                    // Create a PaymentIntent with the order amount and currency
                    const paymentIntent = await stripe.paymentIntents.create({
                        amount: amount,
                        currency: "cad",
                        automatic_payment_methods: {
                            enabled: true,
                        },
                    });
    
                    response.end(JSON.stringify({clientSecret: paymentIntent.client_secret}));
                };
                config_send();
            } 
            if (body.type == 'create-customer') {
                async function create_customer() {
                    // Create a new customer object
                    var customer = await stripe.customers.create({
                        email: req.body.email,
                    });

                    // Save the customer.id in your database alongside your user.
                    // We're simulating authentication with a cookie.
                    res.cookie('customer', customer.id, { maxAge: 900000, httpOnly: true });

                    res.send({ customer: customer });
                };
                create_customer();
            }

            if (body.type == 'create-subscription') {
                console.log(9);
                async function create_subscription() {
                    const customer = await stripe.customers.create({
                        email: body.email,
                        description: 'Fastur.com Customer',
                    });

                    // Create the subscription
                    var priceId = body.priceId;

                    try {
                        var subscription = await stripe.subscriptions.create({
                            customer: customer.id,
                            items: [{
                                price: priceId,
                            }],
                            payment_behavior: 'default_incomplete',
                            expand: ['latest_invoice.payment_intent'],
                        });
                        console.log({
                            subscriptionId: subscription.id,
                            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
                        });

                        response.end(JSON.stringify({
                            subscriptionId: subscription.id,
                            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
                        }));

                    } catch (error) {
                        console.log(error)
                        return response.end("failed");
                    }
                };
                create_subscription();
            };

            if (body.type == 'cancel-subscription') {
                async function cancel_subscription() {
                    // Cancel the subscription
                    try {
                        var deletedSubscription = await stripe.subscriptions.del(
                            req.body.subscriptionId
                        );

                        res.send({ subscription: deletedSubscription });
                    } catch (error) {
                        return res.status(400).send({ error: { message: error.message } });
                    }
                };
                cancel_subscription();
            };

            if (body.type == 'update-subscription') {
                async function update_subscription() {
                    try {
                        var subscription = await stripe.subscriptions.retrieve(
                            req.body.subscriptionId
                        );
                        var updatedSubscription = await stripe.subscriptions.update(
                            req.body.subscriptionId, {
                            items: [{
                                id: subscription.items.data[0].id,
                                price: process.env[req.body.newPriceLookupKey.toUpperCase()],
                            }],
                        }
                        );

                        res.send({ subscription: updatedSubscription });
                    } catch (error) {
                        return res.status(400).send({ error: { message: error.message } });
                    }
                };
                update_subscription();
            };

            if (body.type == 'webhook') {
                async function webhook() {
                    // Retrieve the event by verifying the signature using the raw body and secret.
                    let event;

                    try {
                        event = stripe.webhooks.varructEvent(
                            req.body,
                            req.header('Stripe-Signature'),
                            process.env.STRIPE_WEBHOOK_SECRET
                        );
                    } catch (err) {
                        console.log(err);
                        console.log(`⚠️  Webhook signature verification failed.`);
                        console.log(
                            `⚠️  Check the env file and enter the correct webhook secret.`
                        );
                        return res.sendStatus(400);
                    }

                    // Extract the object from the event.
                    var dataObject = event.data.object;

                    // Handle the event
                    // Review important events for Billing webhooks
                    // https://stripe.com/docs/billing/webhooks
                    // Remove comment to see the various objects sent for this sample
                    switch (event.type) {
                        case 'invoice.payment_succeeded':
                            if (dataObject['billing_reason'] == 'subscription_create') {
                                // The subscription automatically activates after successful payment
                                // Set the payment method used to pay the first invoice
                                // as the default payment method for that subscription
                                var subscription_id = dataObject['subscription']
                                var payment_intent_id = dataObject['payment_intent']

                                // Retrieve the payment intent used to pay the subscription
                                var payment_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

                                try {
                                    var subscription = await stripe.subscriptions.update(
                                        subscription_id,
                                        {
                                            default_payment_method: payment_intent.payment_method,
                                        },
                                    );

                                    console.log("Default payment method set for subscription:" + payment_intent.payment_method);
                                } catch (err) {
                                    console.log(err);
                                    console.log(`⚠️  Falied to update the default payment method for subscription: ${subscription_id}`);
                                }
                            };

                            break;
                        case 'invoice.payment_failed':
                            // If the payment fails or the customer does not have a valid payment method,
                            //  an invoice.payment_failed event is sent, the subscription becomes past_due.
                            // Use this webhook to notify your user that their payment has
                            // failed and to retrieve new card details.
                            break;
                        case 'invoice.finalized':
                            // If you want to manually send out invoices to your customers
                            // or store them locally to reference to avoid hitting Stripe rate limits.
                            break;
                        case 'customer.subscription.deleted':
                            if (event.request != null) {
                                // handle a subscription cancelled by your request
                                // from above.
                            } else {
                                // handle subscription cancelled automatically based
                                // upon your subscription settings.
                            }
                            break;
                        case 'customer.subscription.trial_will_end':
                            // Send notification to your user that the trial will end
                            break;
                        default:
                        // Unexpected event type
                    }
                    response.end("200");
                }
                webhook();
            }
            if (body.type == "subscribe") {
                console.log(body);
                async function subscribe() {
                    var stripe = require('stripe')(LIVE_KEY);

                    if (body.creation == "enterprise") {
                        var product = await stripe.products.create({ name: 'Fastur Enterprise' });
                        var amount = 250000;
                        var recurring = {};
                        var mode = "payment";
                    }
                    if (body.creation == "teams") {
                        var product = await stripe.products.create({ name: 'Fastur Teams' });
                        var amount = 2500;
                        recurring = { interval: 'month' };
                        var mode = 'subscription';
                    }

                    var price = await stripe.prices.create({
                        product: product.id,
                        unit_amount: amount,
                        currency: 'cad',
                        recurring: recurring,
                    });

                    /*
                    var subscription = await stripe.subscriptions.create({
                        customer: '{{CUSTOMER_ID}}',
                        items: [{ price: price.id, quantity: body.seats }],
                    });
                    */

                    var session = await stripe.checkout.sessions.create({
                        line_items: [
                            {
                                price: price.id,
                                quantity: body.seats,
                            },
                        ],
                        mode: mode,
                        success_url: `https://fastur.carrd.co`,
                        cancel_url: `https://fastur.carrd.co`,
                        automatic_tax: { enabled: false },
                    });

                    response.end(session.url);
                }
                subscribe();
            }
            if (body.type == "messages") {
                if (body.amount) {
                    console.log(body);

                }
                var active = Math.random().toString(36).slice(-6);
                var photo = body.photo;
                var photo_ext = "";
                function linkify(inputText) {
                    var replacedText, replacePattern1, replacePattern2, replacePattern3;

                    //URLs starting with http://, https://, or ftp://
                    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
                    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

                    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
                    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
                    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

                    //Change email addresses to mailto:: links.
                    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
                    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

                    return replacedText;
                }
                body.message = linkify(body.message);
                if (photo.includes("jpeg;base64")) {
                    photo_ext = ".jpg";
                    var base64Data = photo.replace(/^data:image\/jpeg;base64,/, "");
                    require("fs").writeFile("/var/www/photos/" + active + ".jpg", base64Data, 'base64', function (err) {
                        console.log(err);
                    });

                    var data = JSON.parse(require("fs").readFileSync("./data.json"));
                    var messages = data["messages"];

                    messages.push({ ext: photo_ext, message: body.message, name: active });
                    require("fs").writeFileSync("./data.json", JSON.stringify(data));

                    response.end("success");

                }
                if (photo.includes("png;base64")) {
                    photo_ext = ".png";
                    var base64Data = photo.replace(/^data:image\/png;base64,/, "");
                    require("fs").writeFile("/var/www/photos/" + active + ".png", base64Data, 'base64', function (err) {
                        console.log(err);
                    });

                    var data = JSON.parse(require("fs").readFileSync("./data.json"));
                    var messages = data["messages"];

                    messages.push({ ext: photo_ext, message: body.message, name: active });
                    require("fs").writeFileSync("./data.json", JSON.stringify(data));

                    response.end("success");

                }
            }
            if (body.type == "distribute") {
                var score = body.score;
                var a = JSON.parse(require("fs").readFileSync("./distributions", "utf8"));
                if (score > a["score"]) {
                    a[body.winner] = body.distribution;
                    a["score"] = body.score;
                    require("fs").writeFileSync("./distributions", JSON.stringify(a))
                }
                response.end(JSON.stringify({ type: "success", message: "successfully sent model to server" }))
            }
            if (body.type == "customer.created") {
                var email = body.data.object.email;
                var name = body.data.object.name;
                var a = JSON.parse(require("fs").readFileSync("data.json"));
                var json = a["users"];
                for (var i in json) {
                    if (json[i].email == email) {
                        json[i].paid = true;
                    }
                }
                a["users"] = json;
                var paid = a["paid"];
                paid.push(email);
                a["paid"] = paid;
                require("fs").writeFileSync("./data.json", JSON.stringify(a));
            }
            if (body.type == "account.updated") {
                console.log(body);
            }
            if (body.type == "publish") {

                var name = body.name;
                var domain = body.domain;
                var page = body.page;
                var url = body.url;
                global.que = [];
                global.f1 = false;
                if (body.email) {
                    function register(name, email, password, active) {
                        var salt = require("crypto")
                            .randomBytes(Math.ceil(16 / 2))
                            .toString("hex")
                            .slice(0, 16);
                        var hash = require("crypto")
                            .createHmac("sha512", salt)
                            .update(password)
                            .digest("hex");
                        var data = JSON.parse(require("fs").readFileSync(
                            "./data.json",
                            "utf8"
                        ));
                        var json = data["users"];

                        var result = json.find(obj => {
                            return obj.email === email;
                        });
                        if (result) {
                            global.f1 = true;
                            response.end(
                                JSON.stringify({
                                    type: "failure",
                                    name: result.name,
                                    message: "Could not publish, already Registered. Log in instead."
                                })
                            );

                        } else {
                            require("child_process").exec("mkdir /var/www/" + name, (err, stdout, stderr) => {
                                console.log(err, stdout, stderr)
                            });
                            json.push({
                                name: name,
                                active: [active],
                                email: email,
                                hash: hash,
                                salt: salt
                            });
                            data["users"] = json;
                            require("fs").writeFileSync(
                                "./data.json",
                                JSON.stringify(data)
                            );
                            var data = JSON.parse(require("fs").readFileSync(
                                "./data.json",
                                "utf8"
                            ));
                            var json = data["users"];

                            var result = json.find(obj => {
                                return obj.email === email;
                            });
                            que.push(result);

                        }

                        return;
                    }
                    register(body.name, body.email, body.password, body.active);
                }
                var data = JSON.parse(require("fs").readFileSync("./data.json", "utf8"));
                var list = data["list"];
                list.push(domain);
                data["list"] = list;
                require("fs").writeFileSync("./data.json", JSON.stringify(data));
                var users = data["users"];
                var result = users.find(obj => {
                    return obj.name === name;
                });
                var body_img = body.img;
                if (result) {
                    var cert = ".fastur.com";
                    if (url == "domain") cert = "";
                    require("child_process").exec("mkdir /var/www/" + name + "/" + domain, (err, stdout, stderr) => {
                        if (err || stderr || require("fs").existsSync("/var/www/" + name + "/" + domain + "index.html")) {
                            require("fs").writeFileSync("/var/www/" + name + "/" + domain + "/index.html", page);
                            if (body_img) {
                                var base64Data = body_img.replace(/^data:image\/png;base64,/, "");
                                require("fs").writeFile("/var/www/" + name + "/" + domain + "/screenshot.png", base64Data, 'base64', function (err) {
                                    console.log(err);
                                });
                            }
                            var blobs = body.blobs;
                            for (var i in blobs) {
                                var a = blobs[i];
                                require("fs").writeFileSync("/var/www/" + name + "/" + domain + "/" + a.name, a.dataurl);
                            }
                        } else {
                            require("fs").writeFileSync("/var/www/" + name + "/" + domain + "/index.html", page);
                            if (body_img) {
                                var base64Data = body_img.replace(/^data:image\/png;base64,/, "");
                                require("fs").writeFile("/var/www/" + name + "/" + domain + "/screenshot.png", base64Data, 'base64', function (err) {
                                    console.log(err);
                                });
                            }
                            var nginx = `server {
                            server_name     xxx` + cert + `;
                            root            /var/www/`+ name + `/xxx;
                            index           index.html;
                            try_files $uri  /index.html;

                            location / {  
	                            lingering_close off;
	                            lingering_time 360000s;
	                            lingering_timeout 360000s;
\	                            keepalive_timeout 999999s;
                                fastcgi_read_timeout 999999s;
                                proxy_read_timeout 999999s;
                                proxy_send_timeout 999999s;
                                proxy_connect_timeout 999999s;
                                uwsgi_read_timeout 600s;                               
                                error_page 404 https://fastur.com/found;
                                if ($request_method ~* "(GET|POST)") {
                                  add_header "Access-Control-Allow-Origin"  *;
                                }
                                if ($request_method = OPTIONS ) {
                                  add_header "Access-Control-Allow-Origin"  *;
                                  add_header "Access-Control-Allow-Methods" "GET, POST, OPTIONS, HEAD";
                                  add_header "Access-Control-Allow-Headers" "Authorization, Origin, X-Requested-With, Content-Type, Accept";
                                  return 200;
                                }
                              }
                            }
                            `;
                            require("fs").writeFileSync("/etc/nginx/sites-enabled/" + domain, nginx.replace(/xxx/g, domain));
                            require("child_process").exec("nginx -s reload", (err, stdout, stderr) => {
                                console.log(err, stdout, stderr)
                            });
                            require("child_process").exec("certbot run -n --nginx --agree-tos -d " + domain + cert + " -m  aisafetyceo@gmail.com  --redirect", (err, stdout, stderr) => {
                                console.log(err, stdout, stderr);
                            });
                        }
                    });
                    if (que[0]) {
                        response.end(JSON.stringify({ type: "success", data: result, domain: "https://" + domain + cert }));
                    } else {
                        if (global.f1 == false) {
                            response.end(JSON.stringify({ type: "success", domain: "https://" + domain + cert }));
                        }
                    }
                }
            }
            if (body.type == "register") {
                console.log(body);
                var name = body.name
                var email = body.email
                var password = body.password
                var photo = body.photo;

                var salt = require("crypto")
                    .randomBytes(Math.ceil(16 / 2))
                    .toString("hex")
                    .slice(0, 16);
                var hash = require("crypto")
                    .createHmac("sha512", salt)
                    .update(password)
                    .digest("hex");
                var data = JSON.parse(require("fs").readFileSync(
                    "./data.json",
                    "utf8"
                ));
                var json = data["users_co"];

                var result = json.find(obj => {
                    return obj.email === email;
                });
                if (result) {
                    global.f1 = true;
                    response.end(
                        JSON.stringify({
                            type: "failure",
                            name: result.name,
                            profile: data,
                            message: "Could not publish, already Registered. Log in instead."
                        })
                    );
                } else {
                    var photo_ext = "";
                    if (photo.includes("jpeg;base64")) {
                        photo_ext = ".jpg";
                        var base64Data = photo.replace(/^data:image\/jpeg;base64,/, "");
                        require("fs").writeFile("/var/www/photos/" + body.name + ".jpg", base64Data, 'base64', function (err) {
                            console.log(err);
                        });

                        json.push({
                            type: "co",
                            ext: photo_ext,
                            name: name,
                            active: [],
                            email: email,
                            hash: hash,
                            salt: salt
                        });
                        data["users_co"] = json;
                        require("fs").writeFileSync("./data.json", JSON.stringify(data));

                    }
                    if (photo.includes("png;base64")) {
                        photo_ext = ".png";
                        var base64Data = photo.replace(/^data:image\/png;base64,/, "");
                        require("fs").writeFile("/var/www/photos/" + body.name + ".png", base64Data, 'base64', function (err) {
                            console.log(err);
                        });
                        json.push({
                            type: "co",
                            ext: photo_ext,
                            name: name,
                            active: [],
                            email: email,
                            hash: hash,
                            salt: salt
                        });
                        data["users"] = json;
                        require("fs").writeFileSync("./data.json", JSON.stringify(data));

                    }
                    response.end(
                        JSON.stringify({
                            type: "success",
                            name: name,
                            message: "Successfully registered, Log in."
                        })
                    );

                }

            }
            if (body.type == "login") {
                function login(email, password, active) {
                    console.log(body);
                    var data = JSON.parse(require("fs").readFileSync(
                        "./data.json",
                        "utf8"
                    ));
                    users = data["users"];
                    var result = users.find(obj => {
                        return obj.email === email;
                    });
                    if (result) {
                        var hash = require("crypto")
                            .createHmac("sha512", result.salt)
                            .update(password)
                            .digest("hex");
                        if (hash == result.hash) {

                            var i = users.findIndex(function (item, i) {
                                return item.email === email;
                            });
                            var temp = users[i].active;
                            temp.push(active);
                            users[i].active = temp;
                            data["users"] = users;
                            require("fs").writeFileSync(
                                "./data.json",
                                JSON.stringify(data)
                            );

                            response.end(
                                JSON.stringify({
                                    type: "success",
                                    name: result.name,
                                    message: "Login Successful",
                                    profile: data,
                                    data: result
                                })
                            );

                            return;
                        } else {
                            response.end(JSON.stringify({
                                type: "failure",
                                message: "Email/Password did not match."
                            }));
                        }
                    } else {
                        response.end(JSON.stringify({
                            type: "failure",
                            message: "Email Not Found"
                        }));
                    }
                    return;
                }
                login(body.email, body.password, body.active)
            }
            if (body.type == "logout") {
                var flag = 0;
                var data = JSON.parse(require("fs").readFileSync("./data.json", "utf8"));
                var users = data["users"];
                for (var i in users) {
                    var temp = users[i].active;
                    if (temp.includes(body.active)) {
                        var index = temp.indexOf(body.active);
                        if (index > -1) {
                            temp.splice(index, 1);
                        }
                        users[i].active = temp;
                        data["users"] = users;
                        require("fs").writeFileSync("./data.json", JSON.stringify(data));
                        flag = 1;
                        response.end("Successfully logged out");
                    }
                }
                if (flag == 0) {
                    response.end("id not found");
                }
            }
            if (body.type == "delete_site") {
                require("child_process").exec("rm -r /var/www/" + body.name + "/" + body.site, (err, stdout, stderr) => {
                    console.log(err, stdout, stderr);
                });
                var data = JSON.parse(require("fs").readFileSync("./data.json", "utf8"));

                list = data["list"];
                for (var i in list) {
                    var a = list[i];
                    list = list.filter((item) => item != body.site);
                    data["list"] = list;

                    require("fs").writeFileSync("./data.json", JSON.stringify(data));
                }

                var data = JSON.parse(require("fs").readFileSync("./data.json", "utf8"));
                var sites = data["templates"];
                var str = body.name + "/" + body.site;
                removeIndex = sites.map(item => item.site).indexOf(str);
                ~removeIndex && sites.splice(removeIndex, 1)
                data["templates"] = sites;
                require("fs").writeFileSync("./data.json", JSON.stringify(data));


                response.end("Successfully deleted site")
            }
            if (body.type == "close_account") {
                var data = require("fs").readFileSync(
                    "./data.json",
                    "utf8"
                );
                data = JSON.parse(data);
                for (var i in data) {
                    var a = data[i];
                    var arr = data.filter((item) => item.name != body.name);
                    require("fs").writeFileSync("./data.json", JSON.stringify(arr));
                    response.end("Successfully closed account")
                }
            }
        })
    }
}).listen(1000);

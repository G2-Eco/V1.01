# Rapport OWASP ZAP - E-Commerce V1.01

ZAP by [Checkmarx](https://checkmarx.com/).


## Summary of Alerts

| Risk Level | Number of Alerts |
| --- | --- |
| High | 0 |
| Medium | 2 |
| Low | 2 |
| Informational | 2 |




## Insights

| Level | Reason | Site | Description | Statistic |
| --- | --- | --- | --- | --- |
| Low | Warning |  | ZAP warnings logged - see the zap.log file for details | 15    |
| Info | Informational | http://backend:8080 | Percentage of responses with status code 2xx | 56 % |
| Info | Informational | http://backend:8080 | Percentage of responses with status code 4xx | 43 % |
| Info | Informational | http://backend:8080 | Percentage of endpoints with content type application/json | 80 % |
| Info | Informational | http://backend:8080 | Percentage of endpoints with content type application/vnd.spring-boot.actuator.v3+json | 10 % |
| Info | Informational | http://backend:8080 | Percentage of endpoints with content type text/plain | 10 % |
| Info | Informational | http://backend:8080 | Percentage of endpoints with method GET | 100 % |
| Info | Informational | http://backend:8080 | Count of total endpoints | 10    |
| Info | Informational | http://backend:8080 | Percentage of slow responses | 3 % |
| Info | Informational | http://frontend:3000 | Percentage of responses with status code 2xx | 80 % |
| Info | Informational | http://frontend:3000 | Percentage of responses with status code 4xx | 19 % |
| Info | Informational | http://frontend:3000 | Percentage of endpoints with content type application/javascript | 48 % |
| Info | Informational | http://frontend:3000 | Percentage of endpoints with content type text/css | 3 % |
| Info | Informational | http://frontend:3000 | Percentage of endpoints with content type text/html | 21 % |
| Info | Informational | http://frontend:3000 | Percentage of endpoints with content type text/x-component | 26 % |
| Info | Informational | http://frontend:3000 | Percentage of endpoints with method GET | 100 % |
| Info | Informational | http://frontend:3000 | Count of total endpoints | 52    |
| Info | Informational | http://frontend:3000 | Percentage of slow responses | 2 % |







## Alerts

| Name | Risk Level | Number of Instances |
| --- | --- | --- |
| Content Security Policy (CSP) Header Not Set | Medium | Systemic |
| Missing Anti-clickjacking Header | Medium | 5 |
| Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s) | Low | Systemic |
| X-Content-Type-Options Header Missing | Low | Systemic |
| Information Disclosure - Sensitive Information in URL | Informational | 1 |
| User Agent Fuzzer | Informational | Systemic |




## Alert Detail



### [ Content Security Policy (CSP) Header Not Set ](https://www.zaproxy.org/docs/alerts/10038/)



##### Medium (High)

### Description

Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

* URL: http://frontend:3000
  * Node Name: `http://frontend:3000`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://frontend:3000/privacy
  * Node Name: `http://frontend:3000/privacy`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://frontend:3000/robots.txt
  * Node Name: `http://frontend:3000/robots.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://frontend:3000/sitemap.xml
  * Node Name: `http://frontend:3000/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://frontend:3000/terms
  * Node Name: `http://frontend:3000/terms`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``

Instances: Systemic


### Solution

Ensure that your web server, application server, load balancer, etc. is configured to set the Content-Security-Policy header.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
* [ https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html ](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
* [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
* [ https://w3c.github.io/webappsec-csp/ ](https://w3c.github.io/webappsec-csp/)
* [ https://web.dev/articles/csp ](https://web.dev/articles/csp)
* [ https://caniuse.com/#feat=contentsecuritypolicy ](https://caniuse.com/#feat=contentsecuritypolicy)
* [ https://content-security-policy.com/ ](https://content-security-policy.com/)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### Source ID: 3

### [ Missing Anti-clickjacking Header ](https://www.zaproxy.org/docs/alerts/10020/)



##### Medium (Medium)

### Description

The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

* URL: http://frontend:3000
  * Node Name: `http://frontend:3000`
  * Method: `GET`
  * Parameter: `x-frame-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://frontend:3000/
  * Node Name: `http://frontend:3000/`
  * Method: `GET`
  * Parameter: `x-frame-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://frontend:3000/cart
  * Node Name: `http://frontend:3000/cart`
  * Method: `GET`
  * Parameter: `x-frame-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://frontend:3000/login
  * Node Name: `http://frontend:3000/login`
  * Method: `GET`
  * Parameter: `x-frame-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://frontend:3000/register
  * Node Name: `http://frontend:3000/register`
  * Method: `GET`
  * Parameter: `x-frame-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 5

### Solution

Modern Web browsers support the Content-Security-Policy and X-Frame-Options HTTP headers. Ensure one of them is set on all web pages returned by your site/app.
If you expect the page to be framed only by pages on your server (e.g. it's part of a FRAMESET) then you'll want to use SAMEORIGIN, otherwise if you never expect the page to be framed, you should use DENY. Alternatively consider implementing Content Security Policy's "frame-ancestors" directive.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options)


#### CWE Id: [ 1021 ](https://cwe.mitre.org/data/definitions/1021.html)


#### WASC Id: 15

#### Source ID: 3

### [ Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s) ](https://www.zaproxy.org/docs/alerts/10037/)



##### Low (Medium)

### Description

The web/application server is leaking information via one or more "X-Powered-By" HTTP response headers. Access to such information may facilitate attackers identifying other frameworks/components your web application is reliant upon and the vulnerabilities such components may be subject to.

* URL: http://frontend:3000
  * Node Name: `http://frontend:3000`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `X-Powered-By: Next.js`
  * Other Info: ``
* URL: http://frontend:3000/forgot-password
  * Node Name: `http://frontend:3000/forgot-password`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `X-Powered-By: Next.js`
  * Other Info: ``
* URL: http://frontend:3000/robots.txt
  * Node Name: `http://frontend:3000/robots.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `X-Powered-By: Next.js`
  * Other Info: ``
* URL: http://frontend:3000/sitemap.xml
  * Node Name: `http://frontend:3000/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `X-Powered-By: Next.js`
  * Other Info: ``
* URL: http://frontend:3000/terms
  * Node Name: `http://frontend:3000/terms`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `X-Powered-By: Next.js`
  * Other Info: ``

Instances: Systemic


### Solution

Ensure that your web server, application server, load balancer, etc. is configured to suppress "X-Powered-By" headers.

### Reference


* [ https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/01-Information_Gathering/08-Fingerprint_Web_Application_Framework ](https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/01-Information_Gathering/08-Fingerprint_Web_Application_Framework)
* [ https://www.troyhunt.com/shhh-dont-let-your-response-headers/ ](https://www.troyhunt.com/shhh-dont-let-your-response-headers/)


#### CWE Id: [ 497 ](https://cwe.mitre.org/data/definitions/497.html)


#### WASC Id: 13

#### Source ID: 3

### [ X-Content-Type-Options Header Missing ](https://www.zaproxy.org/docs/alerts/10021/)



##### Low (Medium)

### Description

The Anti-MIME-Sniffing header X-Content-Type-Options was not set to 'nosniff'. This allows older versions of Internet Explorer and Chrome to perform MIME-sniffing on the response body, potentially causing the response body to be interpreted and displayed as a content type other than the declared content type. Current (early 2014) and legacy versions of Firefox will use the declared content type (if one is set), rather than performing MIME-sniffing.

* URL: http://frontend:3000
  * Node Name: `http://frontend:3000`
  * Method: `GET`
  * Parameter: `x-content-type-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: `This issue still applies to error type pages (401, 403, 500, etc.) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.
At "High" threshold this scan rule will not alert on client or server error responses.`
* URL: http://frontend:3000/
  * Node Name: `http://frontend:3000/`
  * Method: `GET`
  * Parameter: `x-content-type-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: `This issue still applies to error type pages (401, 403, 500, etc.) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.
At "High" threshold this scan rule will not alert on client or server error responses.`
* URL: http://frontend:3000/cart
  * Node Name: `http://frontend:3000/cart`
  * Method: `GET`
  * Parameter: `x-content-type-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: `This issue still applies to error type pages (401, 403, 500, etc.) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.
At "High" threshold this scan rule will not alert on client or server error responses.`
* URL: http://frontend:3000/login
  * Node Name: `http://frontend:3000/login`
  * Method: `GET`
  * Parameter: `x-content-type-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: `This issue still applies to error type pages (401, 403, 500, etc.) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.
At "High" threshold this scan rule will not alert on client or server error responses.`
* URL: http://frontend:3000/register
  * Node Name: `http://frontend:3000/register`
  * Method: `GET`
  * Parameter: `x-content-type-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: `This issue still applies to error type pages (401, 403, 500, etc.) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.
At "High" threshold this scan rule will not alert on client or server error responses.`

Instances: Systemic


### Solution

Ensure that the application/web server sets the Content-Type header appropriately, and that it sets the X-Content-Type-Options header to 'nosniff' for all web pages.
If possible, ensure that the end user uses a standards-compliant and modern web browser that does not perform MIME-sniffing at all, or that can be directed by the web application/web server to not perform MIME-sniffing.

### Reference


* [ https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/gg622941(v=vs.85) ](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/gg622941(v=vs.85))
* [ https://owasp.org/www-community/Security_Headers ](https://owasp.org/www-community/Security_Headers)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### Source ID: 3

### [ Information Disclosure - Sensitive Information in URL ](https://www.zaproxy.org/docs/alerts/10024/)



##### Informational (Medium)

### Description

The request appeared to contain sensitive information leaked in the URL. This can violate PCI and most organizational compliance policies. You can configure the list of strings for this check to add or remove values specific to your environment.

* URL: http://backend:8080/api/v1/auth/verify-email%3Ftoken=test
  * Node Name: `http://backend:8080/api/v1/auth/verify-email (token)`
  * Method: `GET`
  * Parameter: `token`
  * Attack: ``
  * Evidence: `token`
  * Other Info: `The URL contains potentially sensitive information. The following string was found via the pattern: token
token`


Instances: 1

### Solution

Do not pass sensitive information in URIs.

### Reference



#### CWE Id: [ 598 ](https://cwe.mitre.org/data/definitions/598.html)


#### WASC Id: 13

#### Source ID: 3

### [ User Agent Fuzzer ](https://www.zaproxy.org/docs/alerts/10104/)



##### Informational (Medium)

### Description

Check for differences in response based on fuzzed User Agent (eg. mobile sites, access as a Search Engine Crawler). Compares the response statuscode and the hashcode of the response body with the original response.

* URL: http://backend:8080/actuator/prometheus
  * Node Name: `http://backend:8080/actuator/prometheus`
  * Method: `GET`
  * Parameter: `Header User-Agent`
  * Attack: `Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)`
  * Evidence: ``
  * Other Info: ``
* URL: http://backend:8080/actuator/prometheus
  * Node Name: `http://backend:8080/actuator/prometheus`
  * Method: `GET`
  * Parameter: `Header User-Agent`
  * Attack: `Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)`
  * Evidence: ``
  * Other Info: ``
* URL: http://backend:8080/actuator/prometheus
  * Node Name: `http://backend:8080/actuator/prometheus`
  * Method: `GET`
  * Parameter: `Header User-Agent`
  * Attack: `Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)`
  * Evidence: ``
  * Other Info: ``
* URL: http://frontend:3000/%3F_rsc=ehych
  * Node Name: `http://frontend:3000/ (_rsc)`
  * Method: `GET`
  * Parameter: `Header User-Agent`
  * Attack: `Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)`
  * Evidence: ``
  * Other Info: ``
* URL: http://frontend:3000/%3F_rsc=ehych
  * Node Name: `http://frontend:3000/ (_rsc)`
  * Method: `GET`
  * Parameter: `Header User-Agent`
  * Attack: `Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)`
  * Evidence: ``
  * Other Info: ``
* URL: http://frontend:3000/%3F_rsc=ehych
  * Node Name: `http://frontend:3000/ (_rsc)`
  * Method: `GET`
  * Parameter: `Header User-Agent`
  * Attack: `Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)`
  * Evidence: ``
  * Other Info: ``

Instances: Systemic


### Solution



### Reference


* [ https://owasp.org/www-project-web-security-testing-guide/ ](https://owasp.org/www-project-web-security-testing-guide/)



#### Source ID: 1



# COCOHODO launch checks

Use a separate staging Supabase project and test customer accounts. These checks require shop-owned service credentials and physical devices; the local read-only preview does not establish live readiness.

- [ ] Apply the migration; provision the shared staff account; configure six-digit phone OTP and SMS rate limits.
- [ ] Sign up with a real US phone, receive the SMS, verify the code, and see an empty card.
- [ ] Try a wrong code, an expired code, and repeated SMS requests. Confirm helpful errors and provider throttling.
- [ ] Sign out and return with the same phone number. Confirm the same member code and saved balance.
- [ ] Confirm a customer cannot access staff functions, alter their balance through REST, or read another customer’s rows.
- [ ] On iPhone Safari over HTTPS, sign in as staff and allow rear-camera access. Scan a customer’s QR on another device. Confirm the scanner stops and releases the camera after detection and navigation.
- [ ] Repeat on Android Chrome. Deny camera permission and confirm manual code entry works. Try an unrelated QR.
- [ ] Award 8 stamps, then 3. Confirm 10 active + 1 pending on both devices. Confirm further awards are blocked.
- [ ] Serve and redeem the free drink. Confirm 1 active stamp, no pending stamps, and no stamp earned for the free drink.
- [ ] Rapidly click an award, then interrupt connectivity during a request. Reconnect and confirm the saved transaction. Confirm a single event and correct balance.
- [ ] Retry an uncertain transaction after reloading the cashier page. Confirm it applies only once.
- [ ] Test concurrent cashier requests using the real PostgreSQL test runner in a disposable database.
- [ ] Revoke the staff allowlist row and confirm subsequent lookup/award/redemption requests are denied.
- [ ] Confirm the customer dashboard updates within 15 seconds and after returning to the browser tab.
- [ ] Check small-screen layout, keyboard navigation, QR enlargement, and screen-reader labels on both phones.
- [ ] Add the app to the home screen. Confirm branding and standalone opening.
- [ ] Remove test phone/OTP mappings from production, verify HTTPS, back up the database, and verify the deployed environment points to the intended project.

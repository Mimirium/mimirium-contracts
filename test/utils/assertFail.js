async function assertFail(promise, message) {
    try {
        await promise;
    } catch (error) {
        if (message) {
            assert(error.message.includes(message), `Wrong failure type, expected '${message}'`);
        }
        return;
    }

    assert.fail('Expected failure not received');
}

module.exports = assertFail;
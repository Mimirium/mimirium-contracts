function assertArgsArray(event, asserted, shouldbe) {
    for (let i = 0; i < shouldbe.length; i++) {
        if (shouldbe[i].toString() != asserted[i].toString()) {
            assert.fail(`Argument assertion failed for event '${event}' -> '${asserted[i]}' should be '${shouldbe[i]}'`);
        }
    }
}

function assertArgsObject(event, asserted, shouldbe) {
    for (let k in shouldbe) {
        if (k in asserted) {
            assert.equal(shouldbe[k].toString(), asserted[k].toString(), `Argument assertion failed for '${event}' -> '${k}' should be '${shouldbe[k]}' instead '${asserted[k]}'`);
        } else {
            assert.fail(`Missing argument '${k} in event '${event}'`);
        }
    }
}

function assertEvent(tx, event, args) {
    if (!tx.logs) {
        assert.fail("No events emitted");
    }
    for (let e of tx.logs) {
        if (e.event == event) {
            switch (typeof args) {
                case "function":
                    args(e.args);
                    break;
                case "object":
                    if (Array.isArray(args)) {
                        assertArgsArray(event, e.args, args);
                    } else {
                        assertArgsObject(event, e.args, args);
                    }
                    break;
            }
            return true;
        }
    }
    assert.fail(`Event not emitted '${event}'`);
}

module.exports = assertEvent;
function urgentKanbanFilter() {
    return function (input, activate) {
        if (activate) {
            var out = [];
            for (var i = 0; i < input.length; i++) {
                if (input[i].urgent) {
                    out.push(input[i]);
                }
            }
            return out;
        }
        return input;
    }
    ;
}
module.exports = urgentKanbanFilter;


function currentuserKanbanFilter(currentUserService) {
    var currentuser = currentUserService.get();
    return function (input, activate) {
        if (activate) {
            var out = [];
            for (var i = 0; i < input.length; i++) {
                for (var j = 0; j < input[i].assignees.length; j++) {
                    if (input[i].assignees[j].userId === currentuser.id) {
                        out.push(input[i]);
                    }
                }
            }
            return out;
        }
        return input;
    };
}

currentuserKanbanFilter.$inject=["currentUserService"];

module.exports=currentuserKanbanFilter;


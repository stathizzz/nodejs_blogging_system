module.exports = function(response, route) {
    this.response = response;
    this.route = route;
};
module.exports.prototype = {
    extend: function(properties) {
        var Child = module.exports;
        Child.prototype = module.exports.prototype;
        for(var key in properties) {
            Child.prototype[key] = properties[key];
        }
        return Child;
    },
    render: function(data) {
        if(this.response && this.route) {
            this.response.render(this.route, data);
        }
    }
}

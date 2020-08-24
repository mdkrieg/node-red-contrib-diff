const diff = require("diff");

module.exports = function(RED) {
    function DiffNode(config) {
        RED.nodes.createNode(this, config);

        this.old_filename = config.old_filename;
        this.old_filename_type = config.old_filename_type || "str";
        this.new_filename = config.new_filename;
        this.new_filename_type = config.new_filename_type || "str";
        this.old_content = config.old_content;
        this.old_content_type = config.old_content_type || "str";
        this.new_content = config.new_content;
        this.new_content_type = config.new_content_type || "str";
        this.output = config.output || "payload";
        this.context_count = config.context_count||0;

        const node = this;

        node.on("input", function(msg, send, done) {
            const old_filename = RED.util.evaluateNodeProperty(node.old_filename, node.old_filename_type, node, msg);
            const new_filename = RED.util.evaluateNodeProperty(node.new_filename, node.new_filename_type, node, msg);
            const old_content = RED.util.evaluateNodeProperty(node.old_content, node.old_content_type, node, msg);
            const new_content = RED.util.evaluateNodeProperty(node.new_content, node.new_content_type, node, msg);

            const patch = diff.createTwoFilesPatch(
                old_filename, new_filename,
                old_content, new_content,
                undefined, undefined,
                {context: node.context_count}
            );

            msg[node.output] = patch;
            send(msg);
            done();
        });
    }

    RED.nodes.registerType("diff", DiffNode);
};
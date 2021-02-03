"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StoryAction_1 = __importDefault(require("./StoryAction"));
var StoryActionVar = /** @class */ (function (_super) {
    __extends(StoryActionVar, _super);
    function StoryActionVar(params, game) {
        return _super.call(this, params, game) || this;
    }
    StoryActionVar.prototype.execute = function () {
        this.game.managers.logic.setVar(this.params.actor, this.params.body);
        this.resolve();
    };
    return StoryActionVar;
}(StoryAction_1.default));
exports.default = StoryActionVar;
//# sourceMappingURL=StoryActionVar.js.map
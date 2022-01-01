addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "lightblue",
    resource: "重置点", // Name of prestige currency
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires(){return n(5)},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        mult = hasUpgThenMul("p",12,mult)
        mult = hasUpgThenMul("p",15,mult)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        var exp = n(1)
        return exp
    },
    baseResource:"点数",
    baseAmount(){return player.points},
    exponent:0.5,
    row: 1, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    effect(){
        var eff = player.p.points.add(1).pow(0.2)
        eff = hasUpgThenPow("p",11,eff)
        eff = hasUpgThenPow("u1",34,eff)
        eff = hasUpgThenPow("b",11,eff)
        return eff
    },
    effectDescription(){
        var str = `重置点加成点数获取x${format(this.effect())}`
        return str
    },
    passiveGeneration(){
        if(hasMilestone("g",2)) return 0.1
        return 0
    },
    unlocked(){return hasUpgrade("u1",11)},
    layerShown(){return hasUpgrade("u1",11)},
    upgrades: {
        11: {
            description: "允许您使用重置点购买升级点.重置点效果^1.12.",
            effect(){
                var eff = n(1.12)
                return eff
            },
            effectDisplay(){return `^${format(this.effect())}`},
            cost(){return n(10)},
        },
        12: {
            description: "点数加成重置点.",
            effect(){
                var eff = player.points.add(10).log10().pow(2)
                eff = hasUpgThenPow("p",13,eff)      
                return eff
            },
            effectDisplay(){return `x${format(this.effect())}`},
            unlocked(){return hasUpgrade("u1",23)},
            cost(){return n(64)},
        },        
        13: {
            description: "重置点加成点数加成重置点.",
            effect(){
                var eff = player.p.points.add(10).log10().pow(0.75).div(5).add(0.75)                
                eff = hasUpgThenPow("p",14,eff)
                return eff
            },
            effectDisplay(){return `^${format(this.effect())}`},
            unlocked(){return hasUpgrade("u1",23)},
            cost(){return n(128)},
        },        
        14: {
            description: "时间加成重置点加成点数加成重置点.(于^1.5达到软上限,五次根)",
            effect(){
                var eff = player.u1.t.add(10).log10().pow(0.65)
                eff = powsoftcap(eff,n(1.5),5)
                return eff
            },
            effectDisplay(){return `^${format(this.effect())}`},
            unlocked(){return hasUpgrade("u1",23)},
            cost(){return n(512)},
        },
        15: {
            description: "升级点加成重置点.",
            effect(){
                var eff = player.u1.total.div(16).add(1).pow(2)
                return eff
            },
            effectDisplay(){return `x${format(this.effect())}`},
            unlocked(){return hasUpgrade("u1",23)},
            cost(){return n(2048)},
        },
    },
    clickables: {
        11: {
            canClick(){return true},
            display() {return `长按以重置(手机端qol)`},
            onHold(){
                doReset(this.layer)
            }
            unlocked(){return true}
        },
    },
    hotkeys: [
        {key: "p", description: "P: p转", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(layer){
        if(layer == this.layer) return
        if((layer == "b" && hasMilestone("b",1)) || (layer == "g" && hasMilestone("g",1)) || (hasMilestone("b",1) && hasMilestone("g",1))){
            layerDataReset(this.layer,["upgrades"])
            return
        }
        else layerDataReset(this.layer)
    },
})

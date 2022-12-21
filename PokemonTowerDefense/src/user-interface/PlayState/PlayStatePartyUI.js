import Tile from "../../services/Tile.js";
import Panel from "../Panel.js";
import PartyMemberHolder from "./PartyMemberHolder.js";

export default class PlayStatePartyUI extends Panel{

    static MemberPanelY = (Panel.PARTY_MENU.height - PartyMemberHolder.DIMENSIONS.height) / 2;
    static GAP = (Panel.PARTY_MENU.width - PartyMemberHolder.DIMENSIONS.width * 6) / 8;

    constructor(party){
        super(Panel.PARTY_MENU.x, Panel.PARTY_MENU.y, Panel.PARTY_MENU.width, Panel.PARTY_MENU.height, {borderWidth: 5, panelColour: "rgba(0, 0, 0, 0.5)"});
        this.party = party;
        this.partyMemberHolders = []
        for(let i = 0; i < 6; i++){
            const paddingTotal = (i + 1.5) * PlayStatePartyUI.GAP;
            const membersWidthTotal = (i * PartyMemberHolder.DIMENSIONS.width);
            if(this.party.length > i)
                this.partyMemberHolders.push(new PartyMemberHolder(this.position.x / Tile.SIZE + paddingTotal + membersWidthTotal, this.position.y / Tile.SIZE + PlayStatePartyUI.MemberPanelY, this.party[i]))
            else
                this.partyMemberHolders.push(new PartyMemberHolder(this.position.x / Tile.SIZE + paddingTotal + membersWidthTotal, this.position.y / Tile.SIZE + PlayStatePartyUI.MemberPanelY))
        }
    }

    update(dt){
        for (let i = 0; i < this.party.length; i++){
            if(this.partyMemberHolders[i].pokemon == null)
                this.party[i].position = this.partyMemberHolders[i].position;
            this.partyMemberHolders[i].pokemon = this.party[i];
        }
    }

    render(){
        super.render();
        this.partyMemberHolders.forEach(holder => {holder.render();});
    }

}
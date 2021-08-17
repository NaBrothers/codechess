package com.nabrothers.codechess.core.context;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.nabrothers.codechess.core.dao.BattleRecordDAO;
import com.nabrothers.codechess.core.data.Effect;
import com.nabrothers.codechess.core.data.Flyer;
import com.nabrothers.codechess.core.data.Player;
import com.nabrothers.codechess.core.dto.BattleContextDTO;
import com.nabrothers.codechess.core.enums.EffectStatus;
import com.nabrothers.codechess.core.enums.ObjectType;
import com.nabrothers.codechess.core.po.BattleRecordPO;
import com.nabrothers.codechess.core.utils.ApplicationContextProvider;
import com.nabrothers.codechess.core.utils.CopyUtils;

import java.util.*;

public class BattleContext extends Context{

    private List<BattleContextDTO> history = new ArrayList<>();

    private static final BattleRecordDAO battleRecordDAO = ApplicationContextProvider.getBean(BattleRecordDAO.class);

    public BattleContext(int id) {
        this.id = id;
    }

    private Map<Long, Player> playerMap = new HashMap();

    private Map<Long, Flyer> flyerMap = new HashMap();

    // Mock
    {
        Player rooney = new Player(888);
        rooney.setX(4);
        rooney.setY(20);
        playerMap.put(rooney.getSeq(), rooney);
        Player monster = new Player(777);
        monster.setX(20);
        monster.setY(4);
        playerMap.put(monster.getSeq(), monster);
    }

    @Override
    protected void beforeStart() {
        logger.info("[" + id + "] 已启动", id);
        BattleRecordPO record = new BattleRecordPO();
        record.setId(id);
        record.setStatus(status);
        battleRecordDAO.update(record);
        saveStep();
    }

    @Override
    protected boolean doStep() {
        Player rooney = (Player)playerMap.values().toArray()[0];
        Player monster = (Player)playerMap.values().toArray()[1];
        rooney.cast(new Flyer(999, rooney.getX(), rooney.getY(), rooney.getX(), rooney.getY(), 4));
        monster.cast(new Flyer(999, monster.getX(), monster.getY(), monster.getX(), monster.getY(), 4));
        rooney.moveTo(20, 20);
        monster.moveTo(4, 4);
        Iterator<Map.Entry<Long, Flyer>> it = flyerMap.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<Long, Flyer> entry = it.next();
            if (entry.getValue().getStatus() == EffectStatus.FINISH.getCode()) {
                it.remove();
                continue;
            }
            entry.getValue().cast();
        }
        saveStep();
        if (currentStep > 100) {
            return false;
        }
        return true;
    }

    @Override
    protected void afterFinish() {
        logger.info("[" + id + "] 已完成", id);
        BattleRecordPO record = new BattleRecordPO();
        record.setId(id);
        record.setStatus(status);
        record.setResult(JSON.toJSONString(history, SerializerFeature.DisableCircularReferenceDetect));
        battleRecordDAO.update(record);
    }

    private void saveStep() {
        BattleContextDTO battleContextDTO = new BattleContextDTO();
        battleContextDTO.setStep(currentStep);
        battleContextDTO.setPlayers(CopyUtils.copyObjects(playerMap, Player.class));
        battleContextDTO.setFlyers(CopyUtils.copyObjects(flyerMap, Flyer.class));
        history.add(battleContextDTO);
    }


    public List<BattleContextDTO> getHistory() {
        return history;
    }

    public void setHistory(List<BattleContextDTO> history) {
        this.history = history;
    }

    public Map<Long, Player> getPlayerMap() {
        return playerMap;
    }

    public void setPlayerMap(Map<Long, Player> playerMap) {
        this.playerMap = playerMap;
    }

    public Map<Long, Flyer> getFlyerMap() {
        return flyerMap;
    }

    public void setFlyerMap(Map<Long, Flyer> flyerMap) {
        this.flyerMap = flyerMap;
    }
}

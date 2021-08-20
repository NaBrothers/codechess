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
import com.nabrothers.codechess.core.enums.PlayerStatus;
import com.nabrothers.codechess.core.manager.BattleConfigManager;
import com.nabrothers.codechess.core.po.BattleRecordPO;
import com.nabrothers.codechess.core.utils.ApplicationContextProvider;
import com.nabrothers.codechess.core.utils.BattleUtils;
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
        Player rooney1 = new Player(881);
        rooney1.setX(3);
        rooney1.setY(20);
        rooney1.setHp(20);
        rooney1.setUserId(111);
        playerMap.put(rooney1.getSeq(), rooney1);
        Player rooney2 = new Player(882);
        rooney2.setX(5);
        rooney2.setY(20);
        rooney2.setHp(20);
        rooney2.setUserId(111);
        playerMap.put(rooney2.getSeq(), rooney2);
        Player rooney3 = new Player(883);
        rooney3.setX(3);
        rooney3.setY(18);
        rooney3.setHp(20);
        rooney3.setUserId(111);
        playerMap.put(rooney3.getSeq(), rooney3);
        Player monster1 = new Player(771);
        monster1.setX(20);
        monster1.setY(3);
        monster1.setHp(20);
        monster1.setUserId(222);
        playerMap.put(monster1.getSeq(), monster1);
        Player monster2 = new Player(773);
        monster2.setX(18);
        monster2.setY(3);
        monster2.setHp(20);
        monster2.setUserId(222);
        playerMap.put(monster2.getSeq(), monster2);
        Player monster3 = new Player(773);
        monster3.setX(20);
        monster3.setY(5);
        monster3.setHp(20);
        monster3.setUserId(222);
        playerMap.put(monster3.getSeq(), monster3);
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
        for (Player p : playerMap.values()) {
            boolean isValid = false;
            while (!isValid) {
                Random random = new Random();
                int dx = 0, dy = 0;
                switch (random.nextInt(4)) {
                    case 0:
                        dx = 1; dy = 0;
                        break;
                    case 1:
                        dx = 0; dy = 1;
                        break;
                    case 2:
                        dx = -1; dy = 0;
                        break;
                    case 3:
                        dx = 0; dy = -1;
                        break;
                }
                int nx = p.getX() + dx;
                int ny = p.getY() + dy;
                if (nx > 0 && nx < BattleConfigManager.GRID_X - 1 && ny > 0 && ny < BattleConfigManager.GRID_Y - 1) {
                    for (Player p2 : playerMap.values()) {
                        if (BattleUtils.isSameGrid(p, p2)) {
                            break;
                        }
                    }
                    isValid = true;
                    p.move(dx, dy);
                }
            }
        }

        for (Player rooney : playerMap.values()) {
            Player target = null;
            for (Player enemy : playerMap.values()) {
                if (enemy.getStatus() != PlayerStatus.DEAD.getCode() && enemy.getUserId() != rooney.getUserId()) {
                    target = enemy;
                    continue;
                }
            }
            if (target != null) {
                rooney.cast(new Flyer(999, rooney.getX(), rooney.getY(), target.getX(), target.getY(), 2, 1));
            }
        }

        Iterator<Map.Entry<Long, Flyer>> it = flyerMap.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<Long, Flyer> entry = it.next();
            if (entry.getValue().getStatus() == EffectStatus.FINISH.getCode()) {
                it.remove();
            }
        }

        for (Flyer f: flyerMap.values()) {
            f.cast();
            for (Player p : playerMap.values()) {
                if (BattleUtils.isSameGrid(f, p)) {
                    if (f.getOwner() == p.getSeq()) {
                        continue;
                    }
                    f.finish();
                    if (p.getStatus() == PlayerStatus.DEAD.getCode() || playerMap.get(f.getOwner()).getUserId() == p.getUserId()) {
                        continue;
                    }
                    f.addEffect(p);
                }
            }
        }

        saveStep();

        Set<Long> team = new HashSet<>();
        for (Player p: playerMap.values()) {
            if (p.getStatus() != PlayerStatus.DEAD.getCode()) {
                team.add(p.getUserId());
            }
        }

        if (team.size() > 1) {
            return true;
        } else {
            return !flyerMap.isEmpty();
        }
    }

    @Override
    protected void afterFinish() {
        logger.info("[" + id + "] 已完成", id);
        BattleRecordPO record = new BattleRecordPO();
        record.setId(id);
        record.setStatus(status);
        record.setResult(JSON.toJSONString(history, SerializerFeature.DisableCircularReferenceDetect));

        Set<Long> team = new HashSet<>();
        for (Player p: playerMap.values()) {
            if (p.getStatus() != PlayerStatus.DEAD.getCode()) {
                team.add(p.getUserId());
            }
        }

        if (team.size() == 1) {
            record.setWinner(team.iterator().next());
        }

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

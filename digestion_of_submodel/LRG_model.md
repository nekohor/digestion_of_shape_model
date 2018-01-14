# 横向辊缝模型

横向辊缝模型的初始化中，主要做了三件事。
- 计算带钢影响系数
- 计算有效单位凸度的最大改变量（we / cb）
- 计算凸度改变削弱因子


## 凸度改变削弱因子

凸度改变削弱因子计算的输入量，除了厚度和宽度，还需要考虑单位轧制压力、单位轧制压力对出口厚度的偏导数、流变应力、弹性模量和接触弧长度。
```c++
Prf_Chng_Attn_Fac( pce_wid,
                en_pce_thck,
                ex_pce_thck,
                frc_pu_wid,
                dfrcw_dexthck,
                pce_flw_strs,
                pcLPceD->elas_modu,
                arc_of_contact );
```


### 流变应力
流变应力的单位是MPa。
流变应力的维基解释如下：
Flow stress is defined as the instantaneous value of stress required to continue plastically deforming the material - to keep the metal flowing. 
It is the middle value between yield strength and ultimate strength of the metal as a function of strain, which can be expressed:[1]
Yf = Kε^n [1]
Yf = Flow stress, MPa
ε = True strain
K = Strength Coefficient, MPa
n = Strain hardening exponent
Hence, Flow stress can also be defined as the stress required to sustain plastic deformation at a particular strain.

The flow stress is a function of plastic strain.

The following properties have an effect on flow stress: chemical composition, purity, crystal structure, phase constitution, exit microstructure, grain size, and heat treatment.

The flow stress is an important parameter in the fatigue failure of ductile materials. Fatigue failure is caused by crack propagation in materials under a varying load, typically a cyclically varying load. The rate of crack propagation is inversely proportional to the flow stress of the material.


# 横向辊缝模型

横向辊缝模型的初始化中，主要做了三件事。
- 计算带钢影响系数
- 计算有效单位凸度的最大改变量（we / cb）
- 计算凸度改变削弱因子


## 带钢影响系数

带钢影响系数用宽厚比插值获得，这个参数的用途是用来表示入口单位凸度对出口单位凸度的敏感程度。取值在0和1之间。

如果这个参数为0，说明带钢在该道次的变形只有均匀的横向压下，不会导致带钢宽度方向的延伸不均。同样，如果这个参数为1，说明带钢在该道次的变形导致完全的延伸不均，带钢在横向没有金属流动。

## 有效单位凸度的最大改变量

这个参数虽然依据于理论计算，但是我们有了mult调节参数后，这个参数实际就成了我们调整真正的有效单位凸度改变量的有效手段。

在板形设定凸度分配过程中，对于UFD目标值和计算值没偏差的有效单位凸度，以及UFD目标值和计算值存在偏差但通过了浪形判别的有效单位凸度，在修正过程中我们可以调整mult的值来调整有效入口单位凸度的修正量。

## 凸度改变削弱因子

凸度改变削弱因子计算的输入量，除了厚度和宽度，还需要考虑单位轧制压力、单位轧制压力对出口厚度的偏导数、流变应力、弹性模量和接触弧长度。
```c
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


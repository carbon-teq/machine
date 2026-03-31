from manim import *

class VectorIntro(Scene):
    def construct(self):
        # Title
        title = Text("Vectors: Two Perspectives").to_edge(UP)
        self.play(Write(title))

        # Numeric representation
        numeric_title = Text("1. Numeric representation", font_size=36, color=BLUE).shift(UP*1.5 + LEFT*3)
        vector_matrix = Text("v = [3, 2]", font_size=48).next_to(numeric_title, DOWN, buff=0.5)
        
        real_world_text = Text('e.g., [Age, Price]', font_size=24, color=LIGHT_GREY).next_to(vector_matrix, DOWN)

        self.play(Write(numeric_title))
        self.play(Write(vector_matrix), Write(real_world_text))
        self.wait(2)
        
        # Transition to geometric representation
        geometric_title = Text("2. Geometric representation", font_size=36, color=YELLOW).shift(UP*1.5 + RIGHT*3)
        
        self.play(FadeOut(real_world_text))
        
        axes = Axes(
            x_range=[-1, 5, 1],
            y_range=[-1, 5, 1],
            x_length=4,
            y_length=4,
            axis_config={"color": GREY},
        ).next_to(geometric_title, DOWN, buff=0.5)

        vector_arrow = Arrow(axes.c2p(0, 0), axes.c2p(3, 2), buff=0, color=YELLOW)
        
        self.play(Write(geometric_title))
        self.play(Create(axes))
        
        # Draw dotted lines to x and y coordinate
        x_line = DashedLine(axes.c2p(3, 0), axes.c2p(3, 2), color=BLUE)
        y_line = DashedLine(axes.c2p(0, 2), axes.c2p(3, 2), color=BLUE)

        self.play(GrowArrow(vector_arrow))
        self.play(Create(x_line), Create(y_line))
        
        # Add labels
        label_tex = Text("(3, 2)", font_size=24).next_to(vector_arrow.get_end(), UR, buff=0.1)
        self.play(Write(label_tex))

        # Emphasize mapping between lists and arrows
        box1 = SurroundingRectangle(vector_matrix, color=GREEN)
        box2 = SurroundingRectangle(vector_arrow, color=GREEN)
        
        self.play(Create(box1))
        self.play(TransformFromCopy(box1, box2))
        self.wait(3)

        self.play(FadeOut(Group(title, numeric_title, vector_matrix, geometric_title, axes, vector_arrow, x_line, y_line, label_tex, box1, box2)))
